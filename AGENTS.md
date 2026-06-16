# Cartelera — Mapa del Proyecto para Agentes IA

## Stack

- **Framework:** Angular 20 (standalone components, SSR-ready)
- **Lenguaje:** TypeScript ~5.8
- **Estilos:** CSS plano + PostCSS (con PurgeCSS)
- **HTTP Client:** Axios (sin `HttpClient` de Angular)
- **Gráficas:** CanvasJS, ApexCharts, Chart.js, ng2-charts, ngx-charts, D3
- **Tests:** Karma + Jasmine
- **Build:** Angular CLI + Vite + esbuild
- **SSR:** Angular SSR con Express
- **Package manager:** pnpm
- **Despliegue:** Netlify (con `deploy.sh` + `.netlify/`)

## Estructura de directorios

```
cartelera/
├── src/                          # App principal (cartelera)
│   ├── main.ts                   # Entry point (bootstrapApplication)
│   ├── main.server.ts            # Entry point SSR
│   ├── server.ts                 # Servidor Express para SSR
│   ├── index.html                # HTML raíz
│   ├── styles.css                # Estilos globales
│   ├── styles.cs / styles.full.css # (posiblemente legacy)
│   ├── app/
│   │   ├── app.component.ts      # Componente raíz
│   │   ├── app.config.ts         # Providers globales
│   │   ├── app.routes.ts         # Definición de rutas
│   │   ├── interface/
│   │   │   ├── interfaces.ts     # Tipos/Interfaces del dominio
│   │   │   └── enum.ts           # Enums y constantes locales (meses, estados, etc.)
│   │   ├── service/
│   │   │   ├── api.service.ts    # Servicio principal API (Axios, CRUDs)
│   │   │   ├── auth.service.ts   # Autenticación (login Google, token)
│   │   │   ├── actividades.service.ts # Capa extra sobre actividades
│   │   │   ├── comunicacion.service.ts # Subject RxJS para año seleccionado
│   │   │   └── icon.service.ts   # Servicio para SVGs inline seguros
│   │   ├── pipe/
│   │   │   ├── fechas.pipe.ts    # FechaLargaPipe, MesNombrePipe, HorarioFormatPipe
│   │   │   └── tuberias.pipe.ts  # EnumMesPipe, EnumActividadPipe, EnumModalidadPipe,
│   │   │                         # EnumEstadoPipe, GrupoEdadPipe, PertenenciaPipe,
│   │   │                         # IdiomaPipe, DiscapacidadPipe
│   │   ├── shared/icons/
│   │   │   └── icons.ts          # SVG icons como strings constantes
│   │   ├── login/
│   │   │   └── login.component.ts   # Formulario login (FormBuilder + ReactiveForms)
│   │   ├── cartel/
│   │   │   └── cartel.component.ts   # Página pública: cartelera de eventos del mes
│   │   ├── formulario/
│   │   │   └── formulario.component.ts # CRUD de actividades (crear/editar)
│   │   ├── tablaDocencia/
│   │   │   └── tablaDocencia.component.ts # Listado+gestión de actividades con filtros
│   │   ├── dashboar/
│   │   │   └── dashboard.component.ts # Dashboard con reportes, ejecución, resumen anual, Excel
│   │   ├── asistencia/
│   │   │   ├── formularioAsistencia/  # Formulario de registro de asistencia pública
│   │   │   └── asistencia/            # Listado de asistencias de una actividad
│   │   ├── users/
│   │   │   ├── tablaUsers/            # CRUD de usuarios
│   │   │   ├── formUser/              # Crear/editar usuario
│   │   │   └── usuarioActual/         # Perfil del usuario autenticado
│   │   ├── servicios_responsables/
│   │   │   ├── serResponsables/       # Listado de servicios responsables
│   │   │   └── modificarServicio/     # Crear/editar servicio responsable
│   │   ├── reports/autorizado/        # Reporte "autorizado" (cronograma anual)
│   │   ├── signup/                    # Registro público de usuarios
│   │   └── navs/
│   │       ├── navbar/                # Navbar interno (sesión iniciada)
│   │       ├── navbarCliente/         # Navbar público
│   │       └── navbarPlus/            # Navbar con opciones extra
│   ├── assets/
│   │   ├── data.json                  # Datos estáticos (posiblemente catálogos)
│   │   ├── fonts/                     # Tipografía Altivo
│   │   └── images/                    # Logo (logoDocumento.svg)
│   └── signup/                        # (ruta alternativa, misma lógica que app/users)
├── projects/angular19-app/            # Segunda app Angular (posiblemente legacy/test)
├── angular.json                       # Configuración Angular CLI
├── package.json                       # Dependencias y scripts
├── tsconfig.json / tsconfig.app.json  # Config TypeScript
├── postcss.config.js                  # PostCSS + Autoprefixer + PurgeCSS
├── deploy.sh                          # Script de despliegue
└── .netlify/                          # Plugins Netlify
```

## Rutas (`src/app/app.routes.ts`)

| Ruta | Componente | Descripción |
|---|---|---|
| `/` o `/eventos` | `CartelComponent` | Cartelera pública del mes actual |
| `/tabla` | `TablaDocenciaComponent` | Gestión de actividades (CRUD + filtros) |
| `/formulario` | `FormularioComponent` | Crear nueva actividad |
| `/editarActividad/:id` | `FormularioComponent` | Editar actividad existente |
| `/dashboard` | `DashboardComponent` | Reportes, gráficas, descarga Excel |
| `/tablaUsers` | `TablaUsersComponent` | CRUD de usuarios |
| `/formularioUsers` | `FormUserComponent` | Crear nuevo usuario |
| `/editarUser/:id` | `FormUserComponent` | Editar usuario |
| `/signup` | `SignupComponent` | Registro público |
| `/autorizado` | `AutorizadoComponent` | Cronograma anual imprimible |
| `/servicioRes` | `SerResponsablesComponent` | Listado de servicios responsables |
| `/addServicio` | `ModificarServicioComponent` | Crear servicio responsable |
| `/modificarSer/:id` | `ModificarServicioComponent` | Editar servicio responsable |
| `/asistencia/:id` | `FormularioAsistenciaComponent` | Formulario público de asistencia |
| `/asistencias/:id` | `AsistenciaComponent` | Ver lista de asistentes |
| `**` | → redirige a `/` | |

## Flujo de datos

1. **Autenticación**: `LoginComponent` → `ApiService.login()` → POST `/auth/login` → almacena `access_token` en `localStorage`.
2. **Estado de sesión** se guarda en `localStorage`: `access_token`, `username`, `role`, `servicio_id`, `subId`.
3. **Interceptor Axios** en `ApiService` añade `Authorization: Bearer <token>` a cada request.
4. **API base**: `https://www.htecpan.com/fad` (comentadas: localhost y 200.12.44.174).
5. **Llamadas API** via Axios con `Content-Type: application/x-www-form-urlencoded` (por defecto) o `application/json` (cuando se envía body).
6. **Catálogos locales** (meses, estados, modalidades, etc.) viven en `src/app/interface/enum.ts` y como arrays hardcodeados en componentes.
7. **Comunicación entre componentes** via `ComunicacionService` (BehaviorSubject para año seleccionado entre Dashboard y Autorizado).
8. **Iconos SVG** definidos en `shared/icons/icons.ts` como strings constantes y renderizados via `IconService` (DomSanitizer).

## Convenciones de código

- Componentes **standalone** (sin NgModules).
- Prefijo `app-` para selectores.
- Nombres de archivo en **kebab-case** (ej. `tablaUsers.component.ts`).
- Interfaces importadas desde `interface/interfaces.ts`.
- TODOS los componentes declaran `standalone: true`.
- No usan `HttpClient` de Angular — todo via Axios.
- `FormsModule` para template-driven forms (excepto `LoginComponent` que usa `ReactiveFormsModule`).
- CSS plano por componente (no SCSS/SASS).
- `providedIn: 'root'` en todos los servicios.
- `limpiarParametros()` es una función helper standalone (no un Pipe) que filtra valores null/undefined/vacío de objetos de filtros.

## Backend API (FastAPI)

El backend **no está en este repo**. El frontend consume una API FastAPI en `https://www.htecpan.com/fad`. Endpoints principales:

- `/auth/login`, `/auth/me`, `/auth/google` — Auth
- `/actividades/`, `/actividad/crear/`, `/actividad/actualizar/{id}`, `/actividad/eliminar/{id}` — CRUD actividades
- `/user/`, `/user/crear`, `/user/registro`, `/user/actualizar/{id}`, `/user/eliminar/{id}` — CRUD usuarios
- `/servicios_responsables/`, `/servicios_responsables/crear/`, `/servicio_responsable/actualizar/{id}` — CRUD servicios
- `/subdireccion/` — Subdirecciones
- `/tipos_actividad/`, `/modalidades/`, `/estados/`, `/lugareRealizacion/`, `/gruposEdad/` — Catálogos
- `/reporte/vista`, `/reporte/ejecucion`, `/reporte/resumen-anual`, `/reporte/excel` — Reportes
- `/verificador/` — Verificador de conflictos de horario
- `/asistencia/` — CRUD asistencias

## Testing

- `ng test` (Karma + Jasmine).
- Solo hay 1 spec file: `asistencia/asistencia.component.spec.ts`.

## Atajos importantes

| Comando | Descripción |
|---|---|
| `pnpm install` | Instalar dependencias |
| `ng serve` | Servidor desarrollo (localhost:4200) |
| `ng build` | Build producción |
| `ng test` | Tests unitarios |
| `deploy.sh` | Despliegue a Netlify |
