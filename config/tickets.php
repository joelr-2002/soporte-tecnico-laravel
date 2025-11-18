<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Ticket Priorities
    |--------------------------------------------------------------------------
    |
    | Available priority levels for tickets with their display labels and
    | associated colors for UI presentation.
    |
    */

    'priorities' => [
        'low' => [
            'label' => 'Baja',
            'color' => '#10B981', // green
            'order' => 1,
        ],
        'medium' => [
            'label' => 'Media',
            'color' => '#F59E0B', // amber
            'order' => 2,
        ],
        'high' => [
            'label' => 'Alta',
            'color' => '#EF4444', // red
            'order' => 3,
        ],
        'urgent' => [
            'label' => 'Urgente',
            'color' => '#7C3AED', // purple
            'order' => 4,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Ticket Statuses
    |--------------------------------------------------------------------------
    |
    | Available status options for tickets with their display labels and
    | colors for UI presentation.
    |
    */

    'statuses' => [
        'new' => [
            'label' => 'Nuevo',
            'color' => '#3B82F6', // blue
            'order' => 1,
        ],
        'open' => [
            'label' => 'Abierto',
            'color' => '#10B981', // green
            'order' => 2,
        ],
        'in_progress' => [
            'label' => 'En Progreso',
            'color' => '#F59E0B', // amber
            'order' => 3,
        ],
        'on_hold' => [
            'label' => 'En Espera',
            'color' => '#6B7280', // gray
            'order' => 4,
        ],
        'resolved' => [
            'label' => 'Resuelto',
            'color' => '#8B5CF6', // violet
            'order' => 5,
        ],
        'closed' => [
            'label' => 'Cerrado',
            'color' => '#1F2937', // dark gray
            'order' => 6,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | File Upload Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for file attachments on tickets and comments.
    |
    */

    'attachments' => [
        // Maximum file size in kilobytes (default: 10MB)
        'max_size' => env('TICKET_MAX_FILE_SIZE', 10240),

        // Maximum number of files per upload
        'max_files' => 5,

        // Allowed file types (MIME types)
        'allowed_types' => [
            // Images
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',

            // Documents
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'text/csv',

            // Archives
            'application/zip',
            'application/x-rar-compressed',
        ],

        // Allowed file extensions
        'allowed_extensions' => [
            'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
            'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv',
            'zip', 'rar',
        ],

        // Storage disk for attachments
        'disk' => 'public',

        // Directory path within the disk
        'path' => 'attachments',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pagination Settings
    |--------------------------------------------------------------------------
    |
    | Default pagination settings for ticket listings.
    |
    */

    'pagination' => [
        // Default number of items per page
        'per_page' => env('TICKET_PAGINATION', 15),

        // Available per page options
        'per_page_options' => [10, 15, 25, 50, 100],
    ],

    /*
    |--------------------------------------------------------------------------
    | Auto-Assignment Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for automatic ticket assignment to agents.
    |
    */

    'auto_assign' => [
        // Enable/disable auto-assignment
        'enabled' => env('TICKET_AUTO_ASSIGN', true),

        // Assignment strategy: 'round_robin', 'least_tickets', 'random'
        'strategy' => 'round_robin',

        // Maximum tickets an agent can have before being skipped
        'max_tickets_per_agent' => 20,

        // Only auto-assign to online agents
        'only_online_agents' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | Notification Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for ticket-related notifications.
    |
    */

    'notifications' => [
        // Notify client when ticket is created
        'on_create' => true,

        // Notify client when ticket status changes
        'on_status_change' => true,

        // Notify client when agent responds
        'on_agent_response' => true,

        // Notify agent when client responds
        'on_client_response' => true,

        // Notify agent when ticket is assigned
        'on_assignment' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | SLA Settings
    |--------------------------------------------------------------------------
    |
    | Service Level Agreement settings for response and resolution times.
    | Times are in hours.
    |
    */

    'sla' => [
        'low' => [
            'first_response' => 48,
            'resolution' => 120,
        ],
        'medium' => [
            'first_response' => 24,
            'resolution' => 72,
        ],
        'high' => [
            'first_response' => 8,
            'resolution' => 24,
        ],
        'urgent' => [
            'first_response' => 2,
            'resolution' => 8,
        ],
    ],

];
