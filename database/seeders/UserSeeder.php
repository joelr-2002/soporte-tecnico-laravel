<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('es_ES');

        // Create admin user
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('password'),
                'role' => User::ROLE_ADMIN,
                'phone' => $faker->phoneNumber,
                'email_verified_at' => now(),
            ]
        );

        // Create 3 agent users
        $agents = [
            [
                'name' => 'Carlos Agente',
                'email' => 'agent1@example.com',
            ],
            [
                'name' => 'María Soporte',
                'email' => 'agent2@example.com',
            ],
            [
                'name' => 'Juan Técnico',
                'email' => 'agent3@example.com',
            ],
        ];

        foreach ($agents as $agent) {
            User::firstOrCreate(
                ['email' => $agent['email']],
                [
                    'name' => $agent['name'],
                    'email' => $agent['email'],
                    'password' => Hash::make('password'),
                    'role' => User::ROLE_AGENT,
                    'phone' => $faker->phoneNumber,
                    'email_verified_at' => now(),
                ]
            );
        }

        // Create 5 client users
        for ($i = 1; $i <= 5; $i++) {
            User::firstOrCreate(
                ['email' => "client{$i}@example.com"],
                [
                    'name' => $faker->name,
                    'email' => "client{$i}@example.com",
                    'password' => Hash::make('password'),
                    'role' => User::ROLE_CLIENT,
                    'phone' => $faker->phoneNumber,
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
