<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Execute POST request to payment gateway
     */
    private function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data)
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        
        $result = curl_exec($ch);
        curl_close($ch);
        
        return $result;
    }

    /**
     * Create MoMo payment
     */
    public function momo_payment(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'amount' => 'required|numeric|min:1000',
        ]);

        $order = Order::findOrFail($validated['order_id']);
        
        // MoMo test credentials (default)
        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        $partnerCode = 'MOMOBKUN20180529';
        $accessKey = 'klm05TvNBzhg7h7j';
        $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
        
        $orderId = $order->id . '_' . time();
        $requestId = time() . "";
        $amount = (string) $validated['amount'];
        $orderInfo = "Thanh toán đơn hàng #" . $order->id;
        $redirectUrl = env('APP_URL', 'http://localhost:8000') . "/api/customer/payment/momo/return";
        $ipnUrl = env('APP_URL', 'http://localhost:8000') . "/api/customer/payment/momo/callback";
        
        $extraData = "";
        $requestType = "payWithATM";
        
        $rawHash = "accessKey=" . $accessKey . 
                   "&amount=" . $amount . 
                   "&extraData=" . $extraData . 
                   "&ipnUrl=" . $ipnUrl . 
                   "&orderId=" . $orderId . 
                   "&orderInfo=" . $orderInfo . 
                   "&partnerCode=" . $partnerCode . 
                   "&redirectUrl=" . $redirectUrl . 
                   "&requestId=" . $requestId . 
                   "&requestType=" . $requestType;
        
        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        $data = [
            'partnerCode' => $partnerCode,
            'partnerName' => "Green Mart",
            'storeId' => "GreenMartStore",
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature
        ];

        $result = $this->execPostRequest($endpoint, json_encode($data));
        $jsonResult = json_decode($result, true);

        Log::info('MoMo payment request', ['order_id' => $order->id, 'response' => $jsonResult]);

        if (isset($jsonResult['payUrl'])) {
            return response()->json([
                'success' => true,
                'payUrl' => $jsonResult['payUrl'],
                'message' => 'Chuyển hướng đến trang thanh toán MoMo'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Không thể tạo thanh toán MoMo',
            'error' => $jsonResult
        ], 400);
    }

    public function momo_return(Request $request)
    {
        Log::info('MoMo return received', $request->all());

        $orderId = $request->orderId;
        $resultCode = $request->resultCode;
        $signature = $request->signature; // MoMo's signature for verification

        // ✅ Step 1: Verify MoMo signature (prevents fraud)
        if (!$this->verifyMoMoSignature($request->all())) {
            return redirect(env('FRONTEND_URL') . '/payment/failed?reason=invalid_signature');
        }

        // ✅ Step 2: Find order
        $originalOrderId = explode('_', $orderId)[0];
        $order = Order::find($originalOrderId);

        if (!$order) {
            return redirect(env('FRONTEND_URL') . '/payment/failed?reason=order_not_found');
        }

        // ✅ Step 3: Check order hasn't been paid already (prevent replay attacks)
        if ($order->is_paid) {
            return redirect(env('FRONTEND_URL') . '/payment/success?order_id=' . $order->id . '&method=momo');
        }

        // ✅ Step 4: Update order based on MoMo result
        if ($resultCode == 0) {
            $order->update([
                'is_paid' => true,
                'payment_method' => 'MOMO',
                'payment_status' => 'completed',
                'status' => 'ORDER_PLACED',
            ]);

            // ✅ Step 5: Redirect to frontend success page
            // Frontend can then verify ownership when user views order details
            return redirect(env('FRONTEND_URL') . '/payment/success?order_id=' . $order->id . '&method=momo');
        }

        $order->update(['payment_status' => 'failed']);
        return redirect(env('FRONTEND_URL') . '/payment/failed?method=momo');
    }

    /**
     * Verify MoMo signature to prevent fraud
     */
    private function verifyMoMoSignature($data)
    {
        $partnerCode = "MOMOBKUN20180529";
        $accessKey = "klm05TvNBzhg7h7j";
        $secretKey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";

        $rawHash = "accessKey=" . $accessKey . 
                   "&amount=" . $data['amount'] . 
                   "&extraData=" . $data['extraData'] . 
                   "&message=" . $data['message'] . 
                   "&orderId=" . $data['orderId'] . 
                   "&orderInfo=" . $data['orderInfo'] . 
                   "&orderType=" . $data['orderType'] . 
                   "&partnerCode=" . $partnerCode . 
                   "&payType=" . $data['payType'] . 
                   "&requestId=" . $data['requestId'] . 
                   "&responseTime=" . $data['responseTime'] . 
                   "&resultCode=" . $data['resultCode'] . 
                   "&transId=" . $data['transId'];

        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        return $signature === $data['signature'];
    }

    /**
     * MoMo payment callback (IPN)
     */
    public function momo_callback(Request $request)
    {
        Log::info('MoMo callback received', $request->all());

        $orderId = $request->orderId;
        $resultCode = $request->resultCode;
        $originalOrderId = explode('_', $orderId)[0];
        $order = Order::find($originalOrderId);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        if ($resultCode == 0) {
            // Payment success
            $order->update([
                'is_paid' => true,
                'payment_method' => 'MOMO',
                'payment_status' => 'completed',
                'status' => 'ORDER_PLACED',
                'payment_transaction_id' => $request->transId ?? null,
            ]);

            Log::info('MoMo payment successful', ['order_id' => $order->id]);
            return response()->json(['success' => true, 'message' => 'Payment confirmed']);
        }

        // Payment failed
        $order->update(['payment_status' => 'failed']);
        
        Log::warning('MoMo payment failed', ['order_id' => $order->id, 'resultCode' => $resultCode]);
        return response()->json(['success' => false, 'message' => 'Payment failed'], 400);
    }

    /**
     * VNPay payment
     */
    public function vnpay_payment(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'amount' => 'required|numeric|min:1000',
        ]);

        $order = Order::findOrFail($validated['order_id']);
        
        $vnp_TmnCode = "GY39NHH1";
        $vnp_HashSecret = "0962100NIGE4R1PS84XXCEY1CFX3MVRV";
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = env('APP_URL', 'http://localhost:8000') . '/api/customer/payment/vnpay/return';
        
        $vnp_TxnRef = $order->id . '_' . time();
        $vnp_OrderInfo = 'Thanh toan don hang #' . $order->id;
        $vnp_OrderType = 'billpayment';
        $vnp_Amount = $validated['amount'] * 100;
        $vnp_Locale = 'vn';
        $vnp_IpAddr = $request->ip();

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        ];

        ksort($inputData);
        $query = "";
        $hashdata = "";
        
        foreach ($inputData as $key => $value) {
            $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        $vnpSecureHash = hash_hmac('sha512', trim($hashdata, '&'), $vnp_HashSecret);
        $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;

        Log::info('VNPay payment request', ['order_id' => $order->id]);

        return response()->json([
            'success' => true,
            'payUrl' => $vnp_Url,
            'message' => 'Chuyển hướng đến trang thanh toán VNPay'
        ]);
    }

    /**
     * VNPay return callback
     */
    public function vnpay_return(Request $request)
    {
        Log::info('VNPay return received', $request->all());

        $vnp_SecureHash = $request->vnp_SecureHash;
        $vnp_HashSecret = "0962100NIGE4R1PS84XXCEY1CFX3MVRV";
        $inputData = $request->except('vnp_SecureHash', 'vnp_SecureHashType');
        
        ksort($inputData);
        $hashData = "";
        
        foreach ($inputData as $key => $value) {
            $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
        }
        
        $secureHash = hash_hmac('sha512', trim($hashData, '&'), $vnp_HashSecret);
        
        if ($secureHash == $vnp_SecureHash && $request->vnp_ResponseCode == '00') {
            $orderId = explode('_', $request->vnp_TxnRef)[0];
            $order = Order::find($orderId);
            
            if ($order) {
                $order->update([
                    'is_paid' => true,
                    'payment_method' => 'VNPAY',
                    'payment_status' => 'completed',
                    'status' => 'ORDER_PLACED',
                    'payment_transaction_id' => $request->vnp_TransactionNo ?? null, // Store transaction ID
                ]);

                Log::info('VNPay payment successful', ['order_id' => $order->id]);
            }
            
            return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/payment/success?order_id=' . $orderId . '&method=vnpay');
        }
        
        Log::warning('VNPay payment failed', ['vnp_ResponseCode' => $request->vnp_ResponseCode]);
        
        return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/payment/failed?method=vnpay');
    }

    /**
     * VNPay IPN Callback
     */
    public function vnpay_callback(Request $request)
    {
        Log::info('VNPay IPN callback received', $request->all());

        $vnp_SecureHash = $request->vnp_SecureHash;
        $vnp_HashSecret = "0962100NIGE4R1PS84XXCEY1CFX3MVRV";
        $inputData = $request->except('vnp_SecureHash', 'vnp_SecureHashType');
        
        ksort($inputData);
        $hashData = "";
        
        foreach ($inputData as $key => $value) {
            $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
        }
        
        $secureHash = hash_hmac('sha512', trim($hashData, '&'), $vnp_HashSecret);
        
        if ($secureHash == $vnp_SecureHash && $request->vnp_ResponseCode == '00') {
            $orderId = explode('_', $request->vnp_TxnRef)[0];
            $order = Order::find($orderId);
            
            if ($order && !$order->is_paid) {
                $order->update([
                    'is_paid' => true,
                    'payment_method' => 'VNPAY',
                    'payment_status' => 'completed',
                    'status' => 'ORDER_PLACED',
                    'payment_transaction_id' => $request->vnp_TransactionNo,
                ]);

                Log::info('VNPay IPN payment successful', ['order_id' => $order->id]);
            }
            
            return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
        }
        
        Log::warning('VNPay IPN payment failed', ['vnp_ResponseCode' => $request->vnp_ResponseCode]);
        return response()->json(['RspCode' => '99', 'Message' => 'Confirm Fail'], 400);
    }
}