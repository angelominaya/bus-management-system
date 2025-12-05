# Bus Management System

Sistema de gestión de autobuses con API en .NET 8 y frontend en React.

## Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)

## Estructura del Proyecto

```
bus-management-system/
├── Controllers/        # Controladores de la API
├── Data/               # Contexto de base de datos
├── Models/             # Modelos de datos
├── web/                # Frontend React
│   ├── src/
│   │   ├── components/ # Componentes UI
│   │   ├── pages/      # Páginas de la aplicación
│   │   ├── services/   # Servicios de API
│   │   └── types/      # Tipos TypeScript
│   └── package.json
├── Program.cs          # Punto de entrada de la API
└── BusManagement.csproj
```

## Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/angelominaya/bus-management-system.git
cd bus-management-system
```

### 2. Configurar la API (.NET)

```bash
dotnet restore
```

### 3. Configurar el Frontend (React)

```bash
cd web
npm install
```

## Ejecución

### Opción A: Ejecutar ambos en terminales separadas

**Terminal 1 - API:**
```bash
dotnet run
```
La API estará disponible en `http://localhost:5000` (o el puerto configurado).

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev
```
El frontend estará disponible en `http://localhost:3000`.

### Opción B: Solo desarrollo frontend

Asegurarse de que la API esté corriendo, luego:
```bash
cd web
npm run dev
```

## Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/buses` | Listar autobuses |
| POST | `/api/buses` | Crear autobús |
| GET | `/api/buses/{id}` | Obtener autobús |
| PUT | `/api/buses/{id}` | Actualizar autobús |
| DELETE | `/api/buses/{id}` | Eliminar autobús |
| GET | `/api/bus-routes` | Listar rutas |
| POST | `/api/bus-routes` | Crear ruta |
| GET | `/api/schedules` | Listar horarios |
| POST | `/api/schedules` | Crear horario |
| GET | `/api/reservations` | Listar reservas |
| POST | `/api/reservations` | Crear reserva |

## Documentación API

Swagger UI disponible en: `http://localhost:5000/swagger`

## Tecnologías

**Backend:**
- .NET 8
- Entity Framework Core (InMemory)
- Swagger/OpenAPI

**Frontend:**
- React 19
- TypeScript
- React Bootstrap
- React Router
- Axios
- Vite
