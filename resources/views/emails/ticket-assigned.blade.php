@component('mail::message')
# Se le ha asignado un nuevo ticket

Hola {{ $agentName }},

Se le ha asignado un nuevo ticket para su atencion.

**Detalles del ticket:**

@component('mail::panel')
- **Numero de ticket:** {{ $ticket->ticket_number }}
- **Titulo:** {{ $ticket->title }}
- **Prioridad:** {{ ucfirst($ticket->priority) }}
- **Estado:** {{ ucfirst(str_replace('_', ' ', $ticket->status)) }}
- **Creado por:** {{ $ticket->user->name ?? 'Usuario' }}
- **Email del cliente:** {{ $ticket->user->email ?? 'N/A' }}
- **Categoria:** {{ $ticket->category->name ?? 'Sin categoria' }}
- **Fecha de creacion:** {{ $ticket->created_at->format('d/m/Y H:i') }}
@endcomponent

**Descripcion del problema:**
{{ $ticket->description }}

Por favor, revise este ticket y responda al cliente lo antes posible.

@component('mail::button', ['url' => config('app.url') . '/agent/tickets/' . $ticket->id, 'color' => 'primary'])
Atender Ticket
@endcomponent

@component('mail::subcopy')
**Recordatorio:** Los tickets con prioridad alta y urgente deben ser atendidos en las primeras horas.
@endcomponent

Saludos,<br>
{{ config('app.name') }}
@endcomponent
