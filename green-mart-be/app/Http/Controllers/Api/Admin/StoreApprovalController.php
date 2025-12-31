<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Mail\SellerApproved;
use App\Mail\SellerRejected;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class StoreApprovalController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureAdmin($request->user());

        $stores = Store::with('user:id,name,email,status')
            ->when($request->filled('status'), fn($query) => $query->where('status', $request->input('status')))
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = '%' . $request->input('search') . '%';
                $query->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', $search)
                        ->orWhere('email', 'like', $search)
                        ->orWhere('username', 'like', $search)
                        ->orWhereHas('user', fn($q) => $q->where('name', 'like', $search)->orWhere('email', 'like', $search));
                });
            })
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $stores,
        ]);
    }

    public function toggleActive(Store $store, Request $request)
    {
        $this->ensureAdmin($request->user());

        $store->is_active = !$store->is_active;
        $store->save();

        return response()->json([
            'success' => true,
            'message' => 'Trạng thái hoạt động của cửa hàng đã được cập nhật.',
            'data' => [
                'is_active' => $store->is_active,
            ],
        ]);
    }

    public function approve(Store $store, Request $request)
    {
        $this->ensureAdmin($request->user());

        $validator = Validator::make($request->all(), [
            'note' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ]);
        }

        if ($store->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Cửa hàng đã được xử lý trước đó.',
            ]);
        }

        $store->loadMissing('user');


        DB::transaction(function () use ($store) {
            $store->update([
                'status' => 'approved',
                'is_active' => true,
                'reject_reason' => null,
            ]);

            $store->user->update([
                'status' => 'active',
            ]);
        });

        Mail::to($store->user->email)->send(new SellerApproved($store->fresh('user')));

        return response()->json([
            'success' => true,
            'message' => 'Cửa hàng đã được duyệt.',
        ]);
    }

    public function reject(Store $store, Request $request)
    {
        $this->ensureAdmin($request->user());

        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ]);
        }

        if ($store->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Cửa hàng đã được xử lý trước đó.',
            ]);
        }

        $store->loadMissing('user');

        $store->update([
            'status' => 'rejected',
            'is_active' => false,
            'reject_reason' => $validator->validated()['reason'],
        ]);

        Mail::to($store->user->email)->send(new SellerRejected($store->fresh('user')));

        return response()->json([
            'success' => true,
            'message' => 'Đã từ chối cửa hàng.',
        ]);
    }

    private function ensureAdmin($user): void
    {
        if (!$user || !$user->roles()->where('name', 'admin')->exists()) {
            abort(Response::HTTP_FORBIDDEN, 'Bạn không có quyền thực hiện thao tác này.');
        }
    }
}
