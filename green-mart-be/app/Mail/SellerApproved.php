<?php

namespace App\Mail;

use App\Models\Store;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SellerApproved extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Store $store, public string $activationToken)
    {
    }

    public function build(): self
    {
        $sellerPortal = config('app.seller_portal_url', config('app.frontend_url', config('app.url')));

        return $this->subject('Cửa hàng của bạn đã được duyệt')
            ->view('emails.seller.approved', [
                'store' => $this->store,
                'user' => $this->store->user,
                'activationToken' => $this->activationToken,
                'sellerPortalUrl' => $sellerPortal,
            ]);
    }
}

