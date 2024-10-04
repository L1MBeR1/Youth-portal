<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ForgotPassword extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $resetUrl;

    /**
     * Create a new message instance.
     *
     * @param  $user
     * @param  $resetUrl
     * @return void
     */
    public function __construct($user, $resetUrl)
    {
        $this->user = $user;
        $this->resetUrl = $resetUrl;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Password Recovery')
                    ->view('emails.forgotPassword')
                    ->with([
                        'resetUrl' => $this->resetUrl,
                        'user' => $this->user,
                    ]);
    }
}
