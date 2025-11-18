<?php

namespace Database\Seeders;

use App\Models\Sla;
use Illuminate\Database\Seeder;

class SlaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $slas = [
            [
                'name' => 'Low Priority SLA',
                'description' => 'Service level agreement for low priority tickets. Extended timeframes for non-urgent issues.',
                'priority' => 'low',
                'response_time' => 480, // 8 hours
                'resolution_time' => 2880, // 48 hours
                'is_active' => true,
            ],
            [
                'name' => 'Medium Priority SLA',
                'description' => 'Service level agreement for medium priority tickets. Standard timeframes for regular issues.',
                'priority' => 'medium',
                'response_time' => 240, // 4 hours
                'resolution_time' => 1440, // 24 hours
                'is_active' => true,
            ],
            [
                'name' => 'High Priority SLA',
                'description' => 'Service level agreement for high priority tickets. Reduced timeframes for important issues.',
                'priority' => 'high',
                'response_time' => 60, // 1 hour
                'resolution_time' => 480, // 8 hours
                'is_active' => true,
            ],
            [
                'name' => 'Urgent Priority SLA',
                'description' => 'Service level agreement for urgent priority tickets. Immediate response required for critical issues.',
                'priority' => 'urgent',
                'response_time' => 15, // 15 minutes
                'resolution_time' => 120, // 2 hours
                'is_active' => true,
            ],
        ];

        foreach ($slas as $sla) {
            Sla::updateOrCreate(
                ['priority' => $sla['priority'], 'is_active' => true],
                $sla
            );
        }
    }
}
