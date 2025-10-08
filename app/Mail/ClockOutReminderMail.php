<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ClockOutReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $token;

    public function __construct($user, $token)
    {
        $this->user = $user;
        $this->token = $token;
    }

    public function build()
    {
        return $this->subject('Workday Ending Soon – Clock Out Reminder')
            ->view('emails.clock-out-reminder')
            ->with([
                'name' => $this->user->name,
                'token' => $this->token,
            ]);
    }
}
