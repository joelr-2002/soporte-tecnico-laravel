<?php

namespace App\Events;

use App\Models\Comment;
use App\Models\Ticket;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommentAdded
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The ticket instance.
     */
    public Ticket $ticket;

    /**
     * The comment instance.
     */
    public Comment $comment;

    /**
     * Create a new event instance.
     */
    public function __construct(Ticket $ticket, Comment $comment)
    {
        $this->ticket = $ticket;
        $this->comment = $comment;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [
            new PrivateChannel('ticket.' . $this->ticket->id),
        ];

        // Notify ticket owner
        if ($this->ticket->user_id !== $this->comment->user_id) {
            $channels[] = new PrivateChannel('user.' . $this->ticket->user_id);
        }

        // Notify assigned agent
        if ($this->ticket->assigned_to && $this->ticket->assigned_to !== $this->comment->user_id) {
            $channels[] = new PrivateChannel('user.' . $this->ticket->assigned_to);
        }

        return $channels;
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'ticket_number' => $this->ticket->ticket_number,
            'comment_id' => $this->comment->id,
            'user_id' => $this->comment->user_id,
            'user_name' => $this->comment->user->name ?? 'Usuario',
            'content_preview' => \Illuminate\Support\Str::limit($this->comment->content, 100),
            'is_internal' => $this->comment->is_internal,
            'created_at' => $this->comment->created_at->toIso8601String(),
        ];
    }
}
