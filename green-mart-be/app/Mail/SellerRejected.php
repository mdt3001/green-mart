<?php

namespace App\Mail;

use App\Models\Store;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SellerRejected extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Store $store)
    {
    }

    public function build(): self
    {
        return $this->subject('Đăng ký Seller Green Mart không được chấp nhận')
            ->view('emails.seller.rejected', [
                'store' => $this->store,
                'user' => $this->store->user,
            ]);
    }
}

