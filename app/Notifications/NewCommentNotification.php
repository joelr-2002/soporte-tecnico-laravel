<?php

namespace App\Notifications;

use App\Models\Comment;
use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewCommentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The ticket instance.
     */
    protected Ticket $ticket;

    /**
     * The comment instance.
     */
    protected Comment $comment;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket, Comment $comment)
    {
        $this->ticket = $ticket;
        $this->comment = $comment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $commenterName = $this->comment->user->name ?? 'Usuario';

        return (new MailMessage)
            ->subject("Ticket #{$this->ticket->ticket_number} - Nuevo comentario")
            ->markdown('emails.new-comment', [
                'ticket' => $this->ticket,
                'comment' => $this->comment,
                'commenterName' => $commenterName,
                'userName' => $notifiable->name,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $commenterName = $this->comment->user->name ?? 'Usuario';

        return [
            'ticket_id' => $this->ticket->id,
            'ticket_number' => $this->ticket->ticket_number,
            'comment_id' => $this->comment->id,
            'commenter_id' => $this->comment->user_id,
            'commenter_name' => $commenterName,
            'comment_preview' => \Illuminate\Support\Str::limit($this->comment->content, 100),
            'is_internal' => $this->comment->is_internal,
            'message' => "{$commenterName} ha agregado un comentario al ticket #{$this->ticket->ticket_number}",
            'type' => 'new_comment',
        ];
    }
}
