<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        $redirectUrl = env('FRONTEND_URL', 'http://localhost:3000') . "/payment/success";
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

    /**
     * MoMo payment callback (IPN)
     */
    public function momo_callback(Request $request)
    {
        Log::info('MoMo callback received', $request->all());

        $orderId = $request->orderId;
        $resultCode = $request->resultCode;

        // Extract original order ID (before timestamp)
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
                'payment_status' => 'completed'
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
        $vnp_Returnurl = env('FRONTEND_URL', 'http://localhost:3000') . '/payment/vnpay-return';
        
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
                    'payment_status' => 'completed'
                ]);

                Log::info('VNPay payment successful', ['order_id' => $order->id]);
            }
            
            return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/payment/success?order_id=' . $orderId . '&method=vnpay');
        }
        
        Log::warning('VNPay payment failed', ['vnp_ResponseCode' => $request->vnp_ResponseCode]);
        
        return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/payment/failed?method=vnpay');
    }
}