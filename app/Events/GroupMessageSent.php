<?php

namespace App\Events;

use App\Models\GroupMessage;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class GroupMessageSent implements ShouldBroadcastNow
{
    public function __construct(public GroupMessage $message) {}

    public function broadcastOn()
    {
        return new PrivateChannel('group.' . $this->message->group_id);
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->message->id,
            'message' => $this->message->message,
            'user' => [
                'id' => $this->message->user->id,
                'name' => $this->message->user->name,
            ],
            'created_at' => $this->message->created_at->toISOString(),
        ];
    }
}
