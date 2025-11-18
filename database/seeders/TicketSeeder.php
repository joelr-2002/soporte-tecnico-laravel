<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('es_ES');

        // Get all categories
        $categories = Category::all();
        if ($categories->isEmpty()) {
            $this->command->warn('No categories found. Please run CategorySeeder first.');
            return;
        }

        // Get clients and agents
        $clients = User::where('role', User::ROLE_CLIENT)->get();
        $agents = User::where('role', User::ROLE_AGENT)->get();

        if ($clients->isEmpty()) {
            $this->command->warn('No clients found. Please run UserSeeder first.');
            return;
        }

        $statuses = [
            Ticket::STATUS_NEW,
            Ticket::STATUS_OPEN,
            Ticket::STATUS_IN_PROGRESS,
            Ticket::STATUS_ON_HOLD,
            Ticket::STATUS_RESOLVED,
            Ticket::STATUS_CLOSED,
        ];

        $priorities = [
            Ticket::PRIORITY_LOW,
            Ticket::PRIORITY_MEDIUM,
            Ticket::PRIORITY_HIGH,
            Ticket::PRIORITY_URGENT,
        ];

        // Sample ticket titles and descriptions
        $ticketTemplates = [
            [
                'title' => 'No puedo acceder a mi cuenta',
                'description' => 'Estoy intentando iniciar sesión pero el sistema me indica que mi contraseña es incorrecta. He intentado restablecerla pero no recibo el correo.',
            ],
            [
                'title' => 'Error al procesar el pago',
                'description' => 'Intenté realizar un pago con mi tarjeta de crédito pero el sistema muestra un error. El monto fue debitado de mi cuenta pero no se refleja en la plataforma.',
            ],
            [
                'title' => 'Solicitud de factura',
                'description' => 'Necesito obtener la factura de mi última compra para fines contables. Por favor enviarla a mi correo registrado.',
            ],
            [
                'title' => 'Producto defectuoso',
                'description' => 'El producto que recibí presenta defectos de fabricación. Solicito el reemplazo o reembolso según la garantía.',
            ],
            [
                'title' => 'Consulta sobre planes de servicio',
                'description' => 'Me gustaría conocer los diferentes planes disponibles y sus características para evaluar una actualización de mi plan actual.',
            ],
            [
                'title' => 'Problema con la instalación',
                'description' => 'No logro completar la instalación del software. El instalador se detiene al 75% y muestra un código de error.',
            ],
            [
                'title' => 'Demora en el envío',
                'description' => 'Mi pedido debería haber llegado hace 5 días según el tracking, pero aún no lo recibo. Solicito información sobre el estado.',
            ],
            [
                'title' => 'Actualización de datos personales',
                'description' => 'Necesito actualizar mi dirección de envío y número de teléfono en mi perfil pero no encuentro la opción.',
            ],
            [
                'title' => 'Cancelación de suscripción',
                'description' => 'Deseo cancelar mi suscripción mensual. Por favor confirmar que no se realizarán más cargos a mi tarjeta.',
            ],
            [
                'title' => 'Error en la aplicación móvil',
                'description' => 'La aplicación se cierra inesperadamente cuando intento ver el historial de pedidos. Esto ocurre en Android 13.',
            ],
        ];

        // Create 50 tickets
        for ($i = 0; $i < 50; $i++) {
            $template = $faker->randomElement($ticketTemplates);
            $status = $faker->randomElement($statuses);

            // Assign agent for non-new tickets (70% chance)
            $assignedTo = null;
            if ($status !== Ticket::STATUS_NEW && $agents->isNotEmpty() && $faker->boolean(70)) {
                $assignedTo = $faker->randomElement($agents->pluck('id')->toArray());
            }

            // Vary the title slightly for uniqueness
            $title = $template['title'];
            if ($faker->boolean(30)) {
                $title .= ' - ' . $faker->word;
            }

            Ticket::create([
                'user_id' => $faker->randomElement($clients->pluck('id')->toArray()),
                'category_id' => $faker->randomElement($categories->pluck('id')->toArray()),
                'assigned_to' => $assignedTo,
                'title' => $title,
                'description' => $template['description'] . ' ' . $faker->sentence(3),
                'status' => $status,
                'priority' => $faker->randomElement($priorities),
                'created_at' => $faker->dateTimeBetween('-3 months', 'now'),
            ]);
        }
    }
}
