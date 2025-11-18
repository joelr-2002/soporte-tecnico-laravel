<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The ticket instance.
     */
    protected Ticket $ticket;

    /**
     * Whether this notification is for the ticket owner.
     */
    protected bool $isOwner;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket, bool $isOwner = true)
    {
        $this->ticket = $ticket;
        $this->isOwner = $isOwner;
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
        $subject = $this->isOwner
            ? "Ticket #{$this->ticket->ticket_number} - Confirmacion de creacion"
            : "Nuevo ticket #{$this->ticket->ticket_number} requiere atencion";

        $greeting = $this->isOwner
            ? 'Su ticket ha sido creado exitosamente'
            : 'Se ha creado un nuevo ticket en el sistema';

        return (new MailMessage)
            ->subject($subject)
            ->markdown('emails.ticket-created', [
                'ticket' => $this->ticket,
                'isOwner' => $this->isOwner,
                'greeting' => $greeting,
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
        return [
            'ticket_id' => $this->ticket->id,
            'ticket_number' => $this->ticket->ticket_number,
            'title' => $this->ticket->title,
            'priority' => $this->ticket->priority,
            'status' => $this->ticket->status,
            'is_owner' => $this->isOwner,
            'message' => $this->isOwner
                ? "Su ticket #{$this->ticket->ticket_number} ha sido creado exitosamente"
                : "Nuevo ticket #{$this->ticket->ticket_number} requiere atencion",
            'type' => 'ticket_created',
        ];
    }
}
