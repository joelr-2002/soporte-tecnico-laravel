<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Técnico',
                'description' => 'Problemas técnicos con hardware, software o conectividad',
                'is_active' => true,
            ],
            [
                'name' => 'Facturación',
                'description' => 'Consultas sobre pagos, facturas y cargos',
                'is_active' => true,
            ],
            [
                'name' => 'Consulta General',
                'description' => 'Preguntas generales sobre productos y servicios',
                'is_active' => true,
            ],
            [
                'name' => 'Soporte de Producto',
                'description' => 'Ayuda con el uso y configuración de productos',
                'is_active' => true,
            ],
            [
                'name' => 'Reclamos',
                'description' => 'Quejas y reclamos sobre el servicio',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['name' => $category['name']],
                $category
            );
        }
    }
}
