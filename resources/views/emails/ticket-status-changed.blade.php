@component('mail::message')
# Actualizacion de estado de su ticket

Hola {{ $userName }},

Le informamos que el estado de su ticket ha sido actualizado.

**Detalles del cambio:**

@component('mail::panel')
- **Numero de ticket:** {{ $ticket->ticket_number }}
- **Titulo:** {{ $ticket->title }}
- **Estado anterior:** {{ $oldStatus }}
- **Nuevo estado:** {{ $newStatus }}
- **Fecha de actualizacion:** {{ now()->format('d/m/Y H:i') }}
@endcomponent

@if($ticket->status === 'in_progress')
Su ticket esta siendo atendido por nuestro equipo de soporte. Le notificaremos cuando haya novedades.
@elseif($ticket->status === 'on_hold')
Su ticket ha sido puesto en espera. Es posible que necesitemos informacion adicional de su parte.
@elseif($ticket->status === 'resolved')
Su ticket ha sido marcado como resuelto. Si el problema persiste, puede reabrir el ticket respondiendo a este correo.
@elseif($ticket->status === 'closed')
Su ticket ha sido cerrado. Gracias por utilizar nuestro servicio de soporte.
@endif

@if($ticket->assignedAgent)
**Agente asignado:** {{ $ticket->assignedAgent->name }}
@endif

@component('mail::button', ['url' => config('app.url') . '/tickets/' . $ticket->id])
Ver Ticket
@endcomponent

Si tiene alguna pregunta adicional, no dude en contactarnos.

Saludos,<br>
{{ config('app.name') }}
@endcomponent
