@component('mail::message')
# Nuevo comentario en su ticket

Hola {{ $userName }},

Se ha agregado un nuevo comentario al ticket **#{{ $ticket->ticket_number }}**.

**Informacion del ticket:**

@component('mail::panel')
- **Numero de ticket:** {{ $ticket->ticket_number }}
- **Titulo:** {{ $ticket->title }}
- **Estado actual:** {{ ucfirst(str_replace('_', ' ', $ticket->status)) }}
@endcomponent

**Comentario de {{ $commenterName }}:**

@component('mail::panel')
{{ $comment->content }}
@endcomponent

**Fecha del comentario:** {{ $comment->created_at->format('d/m/Y H:i') }}

@component('mail::button', ['url' => config('app.url') . '/tickets/' . $ticket->id . '#comment-' . $comment->id])
Ver Conversacion Completa
@endcomponent

Puede responder a este comentario directamente desde el sistema.

Saludos,<br>
{{ config('app.name') }}
@endcomponent
