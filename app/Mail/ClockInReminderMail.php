<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ClockInReminderMail extends Mailable
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
        return $this->subject('Workday Starting Soon – Clock In Reminder')
            ->view('emails.clock-in-reminder')
            ->with([
                'name' => $this->user->name,
                'token' => $this->token,
            ]);
    }
}
