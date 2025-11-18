<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketStatusChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The ticket instance.
     */
    protected Ticket $ticket;

    /**
     * The previous status.
     */
    protected string $oldStatus;

    /**
     * The new status.
     */
    protected string $newStatus;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket, string $oldStatus, string $newStatus)
    {
        $this->ticket = $ticket;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
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
        return (new MailMessage)
            ->subject("Ticket #{$this->ticket->ticket_number} - Cambio de estado")
            ->markdown('emails.ticket-status-changed', [
                'ticket' => $this->ticket,
                'oldStatus' => $this->getStatusLabel($this->oldStatus),
                'newStatus' => $this->getStatusLabel($this->newStatus),
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
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'old_status_label' => $this->getStatusLabel($this->oldStatus),
            'new_status_label' => $this->getStatusLabel($this->newStatus),
            'message' => "El estado del ticket #{$this->ticket->ticket_number} ha cambiado de {$this->getStatusLabel($this->oldStatus)} a {$this->getStatusLabel($this->newStatus)}",
            'type' => 'ticket_status_changed',
        ];
    }

    /**
     * Get the human-readable status label.
     */
    protected function getStatusLabel(string $status): string
    {
        $labels = [
            'new' => 'Nuevo',
            'open' => 'Abierto',
            'in_progress' => 'En Progreso',
            'on_hold' => 'En Espera',
            'resolved' => 'Resuelto',
            'closed' => 'Cerrado',
        ];

        return $labels[$status] ?? $status;
    }
}
