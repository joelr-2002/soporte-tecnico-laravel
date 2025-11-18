<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('es_ES');

        $tickets = Ticket::all();
        if ($tickets->isEmpty()) {
            $this->command->warn('No tickets found. Please run TicketSeeder first.');
            return;
        }

        $agents = User::whereIn('role', [User::ROLE_AGENT, User::ROLE_ADMIN])->get();

        // Sample comment templates
        $clientComments = [
            'Gracias por la respuesta. Sigo esperando la solución.',
            '¿Cuánto tiempo más tomará resolver este problema?',
            'He seguido los pasos indicados pero el problema persiste.',
            'Adjunto captura de pantalla con el error que me aparece.',
            'Necesito una respuesta urgente por favor.',
            'El problema se solucionó parcialmente, pero ahora tengo otro inconveniente.',
            'Gracias por la ayuda, el problema fue resuelto.',
            'No entiendo las instrucciones proporcionadas.',
        ];

        $agentComments = [
            'Hemos recibido su solicitud y estamos trabajando en ella.',
            'Por favor, podría proporcionar más detalles sobre el problema?',
            'He escalado su caso al equipo técnico para una revisión más detallada.',
            'El problema ha sido identificado y estamos implementando la solución.',
            'Hemos procesado su solicitud correctamente.',
            'Por favor, intente los siguientes pasos: 1) Borrar caché, 2) Reiniciar la aplicación.',
            'Su caso requiere verificación adicional. Le contactaremos pronto.',
            'El problema se debe a mantenimiento programado. El servicio se restablecerá en breve.',
        ];

        $internalNotes = [
            'Cliente VIP - dar prioridad al caso.',
            'Verificado en sistema: el pago fue procesado correctamente.',
            'Contactar al cliente por teléfono si no responde en 24 horas.',
            'Caso relacionado con incidente masivo del día 15.',
            'Requiere aprobación del supervisor para proceder.',
            'El cliente ha tenido múltiples incidencias similares.',
        ];

        foreach ($tickets as $ticket) {
            // Add 2-5 comments per ticket
            $commentCount = $faker->numberBetween(2, 5);

            for ($i = 0; $i < $commentCount; $i++) {
                // Determine if comment is from client or agent
                $isClientComment = $faker->boolean(40);

                if ($isClientComment) {
                    $userId = $ticket->user_id;
                    $content = $faker->randomElement($clientComments);
                    $isInternal = false;
                } else {
                    // Agent comment
                    if ($agents->isEmpty()) {
                        continue;
                    }

                    $userId = $faker->randomElement($agents->pluck('id')->toArray());

                    // 20% chance of internal note
                    $isInternal = $faker->boolean(20);

                    if ($isInternal) {
                        $content = $faker->randomElement($internalNotes);
                    } else {
                        $content = $faker->randomElement($agentComments);
                    }
                }

                // Add some variation to comments
                if ($faker->boolean(30)) {
                    $content .= ' ' . $faker->sentence(2);
                }

                Comment::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $userId,
                    'content' => $content,
                    'is_internal' => $isInternal,
                    'created_at' => $faker->dateTimeBetween($ticket->created_at, 'now'),
                ]);
            }
        }
    }
}
