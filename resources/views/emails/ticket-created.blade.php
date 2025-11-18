@component('mail::message')
# {{ $greeting }}

Hola {{ $userName }},

@if($isOwner)
Su ticket ha sido registrado exitosamente en nuestro sistema de soporte tecnico.

**Detalles del ticket:**

@component('mail::panel')
- **Numero de ticket:** {{ $ticket->ticket_number }}
- **Titulo:** {{ $ticket->title }}
- **Prioridad:** {{ ucfirst($ticket->priority) }}
- **Estado:** Nuevo
- **Fecha de creacion:** {{ $ticket->created_at->format('d/m/Y H:i') }}
@endcomponent

**Descripcion:**
{{ $ticket->description }}

Nuestro equipo revisara su solicitud y se pondra en contacto con usted a la brevedad posible.

@component('mail::button', ['url' => config('app.url') . '/tickets/' . $ticket->id])
Ver Ticket
@endcomponent

@else
Se ha creado un nuevo ticket que requiere atencion.

**Detalles del ticket:**

@component('mail::panel')
- **Numero de ticket:** {{ $ticket->ticket_number }}
- **Titulo:** {{ $ticket->title }}
- **Prioridad:** {{ ucfirst($ticket->priority) }}
- **Creado por:** {{ $ticket->user->name ?? 'Usuario' }}
- **Categoria:** {{ $ticket->category->name ?? 'Sin categoria' }}
- **Fecha de creacion:** {{ $ticket->created_at->format('d/m/Y H:i') }}
@endcomponent

**Descripcion:**
{{ \Illuminate\Support\Str::limit($ticket->description, 300) }}

@component('mail::button', ['url' => config('app.url') . '/admin/tickets/' . $ticket->id])
Revisar Ticket
@endcomponent

@endif

Gracias por utilizar nuestro sistema de soporte.

Saludos,<br>
{{ config('app.name') }}
@endcomponent
