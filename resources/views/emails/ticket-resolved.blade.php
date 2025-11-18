@component('mail::message')
# Su ticket ha sido resuelto

Hola {{ $userName }},

Nos complace informarle que su ticket ha sido marcado como **resuelto**.

**Detalles del ticket:**

@component('mail::panel')
- **Numero de ticket:** {{ $ticket->ticket_number }}
- **Titulo:** {{ $ticket->title }}
- **Fecha de creacion:** {{ $ticket->created_at->format('d/m/Y H:i') }}
- **Fecha de resolucion:** {{ now()->format('d/m/Y H:i') }}
@if($ticket->assignedAgent)
- **Atendido por:** {{ $ticket->assignedAgent->name }}
@endif
@endcomponent

Esperamos haber resuelto su consulta de manera satisfactoria.

@component('mail::button', ['url' => config('app.url') . '/tickets/' . $ticket->id, 'color' => 'success'])
Ver Detalles del Ticket
@endcomponent

**¿El problema persiste?**

Si considera que el problema no ha sido resuelto completamente, puede reabrir el ticket desde el panel de control o contactarnos nuevamente.

---

**¿Como fue su experiencia?**

Su opinion es importante para nosotros. Le invitamos a calificar el servicio recibido.

@component('mail::button', ['url' => config('app.url') . '/tickets/' . $ticket->id . '/feedback', 'color' => 'primary'])
Calificar Servicio
@endcomponent

Gracias por confiar en nuestro equipo de soporte.

Saludos cordiales,<br>
{{ config('app.name') }}
@endcomponent
