<?php

namespace App\Mail;

use App\Models\Store;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SellerRegistrationSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Store $store)
    {
    }

    public function build(): self
    {
        return $this->subject('Đăng ký Seller Green Mart đang chờ duyệt')
            ->view('emails.seller.registration-submitted', [
                'store' => $this->store,
                'user' => $this->store->user,
            ]);
    }
}

