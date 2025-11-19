<?php

namespace App\Http\Requests\Seller;

use Illuminate\Foundation\Http\FormRequest;

class SellerRegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',

            'store_name' => 'required|string|max:255',
            'store_username' => 'required|string|max:255|unique:stores,username',
            'store_email' => 'required|email|max:255|unique:stores,email',
            'store_description' => 'nullable|string',
            'store_address' => 'nullable|string|max:500',
            'store_contact' => 'nullable|string|max:20',
            'store_logo' => 'nullable|url|max:2048',

            'brc_tax_code' => 'nullable|string|max:100',
            'brc_number' => 'nullable|string|max:100',
            'brc_date_of_issue' => 'nullable|date',
            'brc_place_of_issue' => 'nullable|string|max:255',
            'brc_images' => 'nullable|array|max:5',
            'brc_images.*' => 'url|max:2048',
        ];
    }

    public function attributes(): array
    {
        return [
            'store_name' => 'tên cửa hàng',
            'store_username' => 'mã định danh cửa hàng',
            'store_email' => 'email cửa hàng',
        ];
    }
}

