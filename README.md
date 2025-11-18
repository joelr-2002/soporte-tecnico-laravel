# Sistema de Tickets de Soporte Tecnico

Sistema completo de gestion de tickets de soporte tecnico desarrollado con Laravel 12 y React 19. Permite a los clientes crear tickets de soporte, a los agentes gestionarlos y a los administradores supervisar todo el sistema.

## Descripcion

Este sistema proporciona una plataforma integral para la gestion de soporte tecnico, permitiendo:

- Creacion y seguimiento de tickets de soporte
- Comunicacion entre clientes y agentes mediante comentarios
- Asignacion automatica o manual de tickets a agentes
- Generacion de reportes y estadisticas
- Sistema de notificaciones en tiempo real
- Panel de administracion completo

## Caracteristicas Principales

### Gestion de Tickets
- Crear, editar y eliminar tickets
- Asignar prioridades (baja, media, alta, urgente)
- Categorizar tickets por tipo de problema
- Seguimiento del estado (abierto, en progreso, pendiente, resuelto, cerrado)
- Adjuntar archivos a los tickets
- Sistema de comentarios con soporte para usuarios internos

### Sistema de Usuarios
- Tres roles: Administrador, Agente y Cliente
- Autenticacion segura con Laravel Sanctum
- Perfil de usuario editable
- Cambio de contrasena

### Panel de Administracion
- Gestion de usuarios (crear, editar, eliminar)
- Gestion de categorias
- Plantillas de respuestas rapidas
- Visualizacion de todos los tickets

### Reportes y Estadisticas
- Tickets por periodo
- Distribucion por estado
- Distribucion por prioridad
- Tickets por categoria
- Rendimiento de agentes
- Tiempo de resolucion
- Exportacion a CSV

### Notificaciones
- Notificaciones en tiempo real
- Marcar como leidas
- Contador de notificaciones no leidas

## Requisitos

- **PHP** >= 8.2
- **Node.js** >= 18
- **Composer** >= 2.0
- **MySQL** 8.0+ o **PostgreSQL** 13+
- **npm** o **yarn**

## Instalacion

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd soporte-tecnico-laravel
```

### 2. Instalar dependencias de PHP

```bash
composer install
```

### 3. Instalar dependencias de Node.js

```bash
npm install
```

### 4. Configurar el entorno

```bash
cp .env.example .env
```

### 5. Generar la clave de la aplicacion

```bash
php artisan key:generate
```

### 6. Configurar la base de datos

Edita el archivo `.env` con tus credenciales de base de datos:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=soporte_tecnico
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contrasena
```

Para SQLite (desarrollo rapido):

```env
DB_CONNECTION=sqlite
DB_DATABASE=/ruta/absoluta/database.sqlite
```

### 7. Ejecutar migraciones y seeders

```bash
php artisan migrate --seed
```

### 8. Crear enlace simbolico para storage

```bash
php artisan storage:link
```

### 9. Compilar assets del frontend

Para desarrollo:
```bash
npm run dev
```

Para produccion:
```bash
npm run build
```

## Ejecutar la Aplicacion

### Opcion 1: Servidor de desarrollo (recomendado)

```bash
composer dev
```

Este comando inicia simultaneamente:
- Servidor PHP (http://localhost:8000)
- Cola de trabajos
- Servidor Vite para hot-reload

### Opcion 2: Servidores separados

Terminal 1 - Servidor PHP:
```bash
php artisan serve
```

Terminal 2 - Vite:
```bash
npm run dev
```

Terminal 3 - Cola (opcional):
```bash
php artisan queue:listen
```

Accede a la aplicacion en: **http://localhost:8000**

## Credenciales de Prueba

Despues de ejecutar los seeders, puedes usar estas credenciales:

### Administrador
- **Email:** admin@example.com
- **Password:** password

### Agente
- **Email:** agent1@example.com
- **Password:** password

### Cliente
- **Email:** client1@example.com
- **Password:** password

## Documentacion de la API

### Autenticacion

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/api/register` | Registrar nuevo usuario |
| POST | `/api/login` | Iniciar sesion |
| POST | `/api/logout` | Cerrar sesion |
| POST | `/api/forgot-password` | Solicitar reset de contrasena |
| POST | `/api/reset-password` | Resetear contrasena |
| GET | `/api/user` | Obtener usuario autenticado |
| PUT | `/api/user/profile` | Actualizar perfil |
| PUT | `/api/user/password` | Cambiar contrasena |

### Tickets

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/tickets` | Listar tickets |
| POST | `/api/tickets` | Crear ticket |
| GET | `/api/tickets/statistics` | Obtener estadisticas |
| GET | `/api/tickets/{id}` | Ver ticket |
| PUT | `/api/tickets/{id}` | Actualizar ticket |
| DELETE | `/api/tickets/{id}` | Eliminar ticket |
| POST | `/api/tickets/{id}/assign` | Asignar agente |
| POST | `/api/tickets/{id}/status` | Cambiar estado |

### Comentarios

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/tickets/{id}/comments` | Listar comentarios |
| POST | `/api/tickets/{id}/comments` | Crear comentario |
| PUT | `/api/comments/{id}` | Editar comentario |
| DELETE | `/api/comments/{id}` | Eliminar comentario |

### Categorias

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/categories` | Listar categorias |
| POST | `/api/categories` | Crear categoria |
| GET | `/api/categories/{id}` | Ver categoria |
| PUT | `/api/categories/{id}` | Actualizar categoria |
| DELETE | `/api/categories/{id}` | Eliminar categoria |

### Usuarios (Admin)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/users` | Listar usuarios |
| POST | `/api/users` | Crear usuario |
| GET | `/api/users/agents` | Listar agentes |
| GET | `/api/users/{id}` | Ver usuario |
| PUT | `/api/users/{id}` | Actualizar usuario |
| DELETE | `/api/users/{id}` | Eliminar usuario |

### Notificaciones

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/notifications` | Listar notificaciones |
| GET | `/api/notifications/unread-count` | Contar no leidas |
| POST | `/api/notifications/read-all` | Marcar todas leidas |
| POST | `/api/notifications/{id}/read` | Marcar como leida |

### Plantillas de Respuesta

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/response-templates` | Listar plantillas |
| POST | `/api/response-templates` | Crear plantilla |
| GET | `/api/response-templates/{id}` | Ver plantilla |
| PUT | `/api/response-templates/{id}` | Actualizar plantilla |
| DELETE | `/api/response-templates/{id}` | Eliminar plantilla |

### Reportes

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/reports/tickets-by-period` | Tickets por periodo |
| GET | `/api/reports/tickets-by-status` | Tickets por estado |
| GET | `/api/reports/tickets-by-priority` | Tickets por prioridad |
| GET | `/api/reports/tickets-by-category` | Tickets por categoria |
| GET | `/api/reports/agent-performance` | Rendimiento de agentes |
| GET | `/api/reports/resolution-time` | Tiempo de resolucion |
| GET | `/api/reports/export-csv` | Exportar a CSV |

## Estructura del Proyecto

```
soporte-tecnico-laravel/
├── app/
│   ├── Actions/              # Acciones de Fortify
│   ├── Events/               # Eventos del sistema
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/          # Controladores de la API
│   │   └── Middleware/       # Middleware personalizado
│   ├── Listeners/            # Listeners de eventos
│   ├── Models/               # Modelos Eloquent
│   ├── Notifications/        # Clases de notificaciones
│   ├── Policies/             # Politicas de autorizacion
│   ├── Providers/            # Service providers
│   └── Services/             # Servicios de la aplicacion
├── bootstrap/                # Archivos de inicio
├── config/                   # Configuraciones
├── database/
│   ├── migrations/           # Migraciones de BD
│   └── seeders/              # Seeders de datos
├── public/                   # Assets publicos
├── resources/
│   ├── css/                  # Estilos CSS
│   ├── js/
│   │   ├── components/       # Componentes React
│   │   │   └── ui/           # Componentes UI reutilizables
│   │   ├── hooks/            # Custom hooks
│   │   ├── layouts/          # Layouts de la app
│   │   ├── lib/              # Utilidades
│   │   ├── pages/            # Paginas/Vistas
│   │   │   ├── admin/        # Paginas de admin
│   │   │   ├── auth/         # Paginas de auth
│   │   │   ├── settings/     # Configuraciones
│   │   │   └── tickets/      # Gestion de tickets
│   │   ├── services/         # Servicios API
│   │   ├── stores/           # Estado global (Zustand)
│   │   └── types/            # Tipos TypeScript
│   └── views/                # Vistas Blade
├── routes/
│   ├── api.php               # Rutas de la API
│   └── web.php               # Rutas web
├── storage/                  # Almacenamiento
├── tests/                    # Tests
├── composer.json             # Dependencias PHP
├── package.json              # Dependencias Node
├── tailwind.config.js        # Config Tailwind
├── tsconfig.json             # Config TypeScript
└── vite.config.ts            # Config Vite
```

## Tecnologias Utilizadas

### Backend
- **Laravel 12** - Framework PHP
- **Laravel Sanctum** - Autenticacion API
- **Laravel Fortify** - Autenticacion backend
- **MySQL/PostgreSQL** - Base de datos

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estatico
- **Inertia.js** - SPA sin API separada
- **Tailwind CSS 4** - Framework CSS
- **Ant Design** - Componentes UI
- **Zustand** - Gestion de estado
- **Vite** - Build tool

### Herramientas de Desarrollo
- **ESLint** - Linting
- **Prettier** - Formateo de codigo
- **Pest** - Testing PHP

## Testing

Ejecutar tests:

```bash
php artisan test
```

O con Pest:

```bash
./vendor/bin/pest
```

## Comandos Utiles

```bash
# Limpiar cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Regenerar cache
php artisan config:cache
php artisan route:cache

# Resetear base de datos con seeders
php artisan migrate:fresh --seed

# Ver rutas
php artisan route:list

# Formatear codigo
npm run format
npm run lint
```

## Variables de Entorno Importantes

| Variable | Descripcion | Valor por defecto |
|----------|-------------|-------------------|
| `APP_NAME` | Nombre de la aplicacion | Soporte Tecnico |
| `APP_LOCALE` | Idioma de la app | es |
| `DB_CONNECTION` | Driver de BD | mysql |
| `MAIL_MAILER` | Driver de correo | smtp |
| `TICKET_MAX_FILE_SIZE` | Tamano max de archivos (KB) | 10240 |
| `TICKET_AUTO_ASSIGN` | Auto-asignar tickets | true |
| `TICKET_PAGINATION` | Items por pagina | 15 |

## Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva caracteristica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto esta bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para mas detalles.

## Soporte

Si encuentras algun problema o tienes sugerencias, por favor abre un issue en el repositorio.

---

Desarrollado con Laravel y React
