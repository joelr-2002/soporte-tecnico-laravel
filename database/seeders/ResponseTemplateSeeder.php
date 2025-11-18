<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\ResponseTemplate;
use Illuminate\Database\Seeder;

class ResponseTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();

        // General templates (no specific category)
        $generalTemplates = [
            // Greeting templates
            [
                'name' => 'Saludo inicial',
                'content' => "Estimado/a cliente,\n\nGracias por contactarnos. Hemos recibido su solicitud y un agente de soporte la atenderá a la brevedad.\n\nSaludos cordiales,\nEquipo de Soporte",
                'category_id' => null,
            ],
            [
                'name' => 'Saludo con nombre',
                'content' => "Hola {nombre},\n\nEspero que se encuentre bien. Estoy revisando su caso y le responderé con una solución lo antes posible.\n\nQuedo atento/a,\n{agente}",
                'category_id' => null,
            ],
            // Closing templates
            [
                'name' => 'Cierre estándar',
                'content' => "Si tiene alguna otra consulta, no dude en contactarnos.\n\nGracias por su preferencia.\nSaludos cordiales,\nEquipo de Soporte Técnico",
                'category_id' => null,
            ],
            [
                'name' => 'Cierre con encuesta',
                'content' => "Su caso ha sido resuelto. Nos gustaría conocer su opinión sobre la atención recibida.\n\nPor favor, responda a este mensaje con una calificación del 1 al 5.\n\nGracias por su tiempo,\nEquipo de Soporte",
                'category_id' => null,
            ],
            [
                'name' => 'Solicitud de información',
                'content' => "Para poder ayudarle mejor, necesitamos la siguiente información:\n\n- Número de cuenta o ID de usuario\n- Descripción detallada del problema\n- Capturas de pantalla (si aplica)\n\nQuedamos atentos a su respuesta.",
                'category_id' => null,
            ],
        ];

        foreach ($generalTemplates as $template) {
            ResponseTemplate::firstOrCreate(
                ['name' => $template['name']],
                $template
            );
        }

        // Category-specific templates
        if ($categories->isNotEmpty()) {
            // Get specific categories
            $tecnico = $categories->firstWhere('name', 'Técnico');
            $facturacion = $categories->firstWhere('name', 'Facturación');
            $consulta = $categories->firstWhere('name', 'Consulta General');
            $producto = $categories->firstWhere('name', 'Soporte de Producto');
            $reclamos = $categories->firstWhere('name', 'Reclamos');

            $categoryTemplates = [];

            if ($tecnico) {
                $categoryTemplates[] = [
                    'name' => 'Reinicio de contraseña',
                    'content' => "Para restablecer su contraseña, siga estos pasos:\n\n1. Vaya a la página de inicio de sesión\n2. Haga clic en '¿Olvidó su contraseña?'\n3. Ingrese su correo electrónico registrado\n4. Revise su bandeja de entrada (y spam)\n5. Siga el enlace del correo para crear una nueva contraseña\n\nSi el problema persiste, indíquenos para asistirle personalmente.",
                    'category_id' => $tecnico->id,
                ];
                $categoryTemplates[] = [
                    'name' => 'Problema de conexión',
                    'content' => "Por favor, intente los siguientes pasos:\n\n1. Verifique su conexión a internet\n2. Limpie la caché de su navegador\n3. Intente con otro navegador\n4. Desactive temporalmente el antivirus/firewall\n5. Reinicie su router\n\nSi ninguno de estos pasos funciona, envíenos una captura del error.",
                    'category_id' => $tecnico->id,
                ];
            }

            if ($facturacion) {
                $categoryTemplates[] = [
                    'name' => 'Factura enviada',
                    'content' => "Le informamos que su factura ha sido enviada al correo electrónico registrado en su cuenta.\n\nSi no la encuentra en su bandeja de entrada, por favor revise la carpeta de spam.\n\nPara futuras consultas sobre facturación, puede acceder al historial desde su panel de usuario.",
                    'category_id' => $facturacion->id,
                ];
                $categoryTemplates[] = [
                    'name' => 'Pago confirmado',
                    'content' => "Le confirmamos que su pago ha sido procesado exitosamente.\n\nDetalles:\n- Monto: {monto}\n- Fecha: {fecha}\n- Referencia: {referencia}\n\nEl comprobante será enviado a su correo en los próximos minutos.",
                    'category_id' => $facturacion->id,
                ];
            }

            if ($producto) {
                $categoryTemplates[] = [
                    'name' => 'Guía de configuración',
                    'content' => "Para configurar su producto correctamente:\n\n1. Descargue el manual desde nuestro sitio web\n2. Verifique los requisitos del sistema\n3. Siga las instrucciones paso a paso\n4. Reinicie el sistema después de la configuración\n\nSi necesita asistencia adicional, podemos programar una sesión de soporte remoto.",
                    'category_id' => $producto->id,
                ];
            }

            if ($reclamos) {
                $categoryTemplates[] = [
                    'name' => 'Reclamo recibido',
                    'content' => "Lamentamos los inconvenientes ocasionados. Su reclamo ha sido registrado y será atendido con prioridad.\n\nNúmero de reclamo: {numero_reclamo}\nTiempo estimado de respuesta: 24-48 horas hábiles\n\nNos comunicaremos con usted a la brevedad con una solución.",
                    'category_id' => $reclamos->id,
                ];
            }

            foreach ($categoryTemplates as $template) {
                ResponseTemplate::firstOrCreate(
                    ['name' => $template['name']],
                    $template
                );
            }
        }
    }
}
