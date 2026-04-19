# TinyFood — Frontend

> **Para IA del IDE:** Lee este documento completo antes de generar o sugerir cualquier código. Contiene las reglas, arquitectura y convenciones de este proyecto.

## 1. Contexto del Negocio

**Problema:** Los usuarios desperdician comida por no llevar un control de su despensa y no saben qué cocinar con lo que tienen, especialmente considerando restricciones médicas o nutricionales.

**Solución:** Aplicación móvil que gestiona la despensa del hogar con ayuda de IA:

- El usuario fotografía sus alimentos → la IA los identifica y estima su fecha de caducidad.
- La app alerta antes de que los alimentos se estropeen.
- Sugiere recetas basadas en el inventario actual, el IMC y las restricciones del usuario.

**Happy Path:**

```
Usuario entra
  → Registra alimento con foto
    → IA etiqueta nombre, categoría y cantidad
      → Se asigna fecha estimada de vencimiento
        → App alerta antes del vencimiento
          → App sugiere recetas con lo disponible
            → Usuario cocina sin desperdiciar
```

---

## 2. Stack Tecnológico

| Herramienta             | Versión  | Uso                                           |
| ----------------------- | -------- | --------------------------------------------- |
| Expo                    | ~54.0.33 | Runtime/build de React Native                 |
| React Native            | 0.81.5   | Framework base móvil                          |
| React                   | 19.1.0   | UI                                            |
| TypeScript              | ~5.9.2   | **Obligatorio** en todo el proyecto           |
| Expo Router             | ~6.0.23  | Navegación basada en archivos                 |
| NativeWind              | ^4.2.3   | Estilos con clases Tailwind                   |
| Tailwind CSS            | ^3.4.19  | Fuente de clases de NativeWind                |
| Axios                   | ^1.15.0  | Cliente HTTP (para servicios REST auxiliares) |
| Google Sign-In          | ^13.1.0  | Autenticación con Google OAuth                |
| React Native Reanimated | ~4.1.1   | Animaciones nativas                           |

**Scripts disponibles:**

```bash
expo start          # Inicia el servidor de desarrollo (Expo Go / simulador)
expo start --ios    # Simulador iOS
expo start --android # Emulador Android
expo start --web    # Versión web (experimental)
```

---

## 3. Arquitectura Modular (Obligatoria)

Cada funcionalidad se agrupa en un **módulo** dentro de `modules/`. Cada módulo tiene exactamente 3 capas:

```
modules/
  <nombre-modulo>/
    components/   ← Capa Presentation
    hooks/        ← Capa Logic
    services/     ← Capa Service (DTOs + comunicación externa)
```

### 3.1 Capa Presentation — `components/`

- **Responsabilidad:** Renderizado visual únicamente.
- **Regla:** No contiene lógica de negocio ni llamadas directas a servicios.
- Consume únicamente los hooks de la capa Logic.
- Convención de nombre para los screens: `<modulo>.screen.tsx` (ej. `login.screen.tsx`, `home.screen.tsx`).

**Ejemplo:** `modules/login/components/login.screen.tsx`

### 3.2 Capa Logic — `hooks/`

- **Responsabilidad:** Lógica de negocio del frontend. Orquesta estados, validaciones y llamadas a servicios.
- Implementada mediante React Hooks (`use-<modulo>.ts`).
- Es el único punto de contacto entre Presentation y Service.

**Ejemplo actual:** `modules/login/hooks/use-login.ts`

```typescript
export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    /* orquesta LoginService.authenticate */
  };
  const handleGoogleLogin = async () => {
    /* orquesta Google Sign-In */
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
    handleGoogleLogin,
  };
}
```

### 3.3 Capa Service — `services/`

- **Responsabilidad:** Comunicación con la API (WebSockets o HTTP). Define los DTOs de entrada/salida.
- Estructura por archivo:
  - `<modulo>.service.ts` — Métodos de comunicación (estáticos o instanciados).
  - `requests.ts` — Interfaces/types de los payloads enviados a la API.
  - `responses.ts` — Interfaces/types de las respuestas recibidas de la API.

**Ejemplo actual:** `modules/login/services/responses.ts`

```typescript
export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: { id: string; name: string; email: string };
  };
  error?: string;
}
```

---

## 4. Estructura de Rutas (Expo Router)

Expo Router usa navegación basada en el sistema de archivos dentro de `app/`.

```
app/
  _layout.tsx   ← Layout raíz. Stack Navigator con animación slide_from_right y header oculto.
  index.tsx     ← Pantalla de Login (ruta "/")
  home.tsx      ← Pantalla principal (ruta "/home")
```

Cada archivo de ruta en `app/` importa el componente de presentación correspondiente desde su módulo:

- `app/index.tsx` → renderiza componente del módulo `login`
- `app/home.tsx` → renderiza componente del módulo `home`

---

## 5. Módulos Actuales

### `modules/login`

Gestiona el flujo de autenticación del usuario.

| Archivo                       | Propósito                                           |
| ----------------------------- | --------------------------------------------------- |
| `components/login.screen.tsx` | UI del formulario de login                          |
| `hooks/use-login.ts`          | Estados y acciones de login/Google                  |
| `services/login.service.ts`   | Llamada a autenticación (actualmente mock)          |
| `services/requests.ts`        | `LoginRequest { email?, password?, token? }`        |
| `services/responses.ts`       | `LoginResponse { success, message, data?, error? }` |

**Flujo:** `LoginView` → consume `useLogin` → llama `LoginService.authenticate` → navega a `/home` si `success: true`.

**Estado actual:** `LoginService.authenticate` usa un mock con delay de 1500ms. El token de Google también es mock (`'google-123'`). Está preparado para reemplazarse con la llamada real a la API WebSocket.

### `modules/home`

Panel principal tras autenticación.

| Archivo                      | Propósito                                                  |
| ---------------------------- | ---------------------------------------------------------- |
| `components/home.screen.tsx` | UI del dashboard                                           |
| `hooks/use-home.ts`          | Carga de métricas, logout                                  |
| `services/home.service.ts`   | Fetch de datos del dashboard (actualmente mock)            |
| `services/requests.ts`       | `HomeRequest { page: number }`                             |
| `services/responses.ts`      | `HomeResponse`, `HomeItemData { id, title, value, trend }` |

### `modules/core`

Módulo transversal para servicios compartidos (actualmente vacío, se usará para el cliente WebSocket global, contextos, etc.).

---

## 6. Estilos

- **Motor:** NativeWind v4 (Tailwind CSS para React Native).
- **Configuración:** `tailwind.config.js` + `global.css` (importado en `app/_layout.tsx`).
- **Regla:** Todo estilizado debe hacerse exclusivamente con clases de Tailwind a través de NativeWind (`className="..."`). **No usar `StyleSheet.create` ni estilos inline.**
- **Prettier:** `prettier-plugin-tailwindcss` ordena automáticamente las clases de Tailwind.

---

## 7. Tipado TypeScript

- TypeScript es obligatorio en todos los archivos (`.ts` / `.tsx`).
- Todo payload de entrada y salida de la API debe tener su interfaz en `services/requests.ts` y `services/responses.ts` del módulo correspondiente.
- Nunca usar `any` a menos que sea estrictamente necesario y justificado con comentario.

---

## 8. Convenciones de Código

| Concepto            | Convención                                         |
| ------------------- | -------------------------------------------------- |
| Nombre de módulo    | `kebab-case` (ej. `pantry`, `user-profile`)        |
| Hooks               | `use-<modulo>.ts`, función exportada `useModulo()` |
| Componentes (views) | `<modulo>.screen.tsx`, export default              |
| Servicios           | `<modulo>.service.ts`, clase con métodos static    |
| DTOs entrada        | `requests.ts`, interfaz `<Modulo>Request`          |
| DTOs salida         | `responses.ts`, interfaz `<Modulo>Response`        |
| Pantallas (rutas)   | `app/<pantalla>.tsx`, export default               |

---

## 9. Variables de Entorno

El archivo `.env` en la raíz del proyecto define:

```env
# URL base de la API (Gateway WebSocket)
API_URL=http://localhost:3000
```

> Expo expone variables de entorno con prefijo `EXPO_PUBLIC_` para acceso desde el cliente. Revisa `expo-constants` para configuración adicional.

---

## 10. Estado de Desarrollo (MVP)

Los servicios actuales usan **mocks locales** con delays artificiales que simulan latencia de red. Cada mock está marcado con el comentario `// Mock Response` o `// Mock Request` y el código real comentado. Al integrar con la API real:

1. Reemplazar el mock por la llamada WebSocket correspondiente (via `socket.emit / socket.on`).
2. El evento de WebSocket debe seguir la convención de la API: `modulo:accion` (ej. `auth:sync`, `pantry:analyze_image`).
3. El token de autenticación de Supabase debe enviarse en el payload o en el handshake inicial de la conexión.

---

## 11. Próximos Módulos a Desarrollar

Siguiendo la arquitectura de 3 capas (`components/`, `hooks/`, `services/`):

| Módulo         | Descripción                                                                         |
| -------------- | ----------------------------------------------------------------------------------- |
| `pantry`       | Gestión del inventario de alimentos. Envía imágenes via WS y recibe análisis de IA. |
| `recipes`      | Sugerencias de recetas basadas en inventario y perfil del usuario.                  |
| `user-profile` | Configuración de peso, talla, alergias, preferencias y alimentos prohibidos.        |
| `alerts`       | Notificaciones de alimentos próximos a vencer.                                      |

## EJECUCION

# 1. Clonar y preparar

git clone <repo>
cd tinyfood && npm install
cd ../tinyfoodapi && npm install

# 2. Copiar los .env (el equipo los recibe de ti)

# 3. Levantar todo

# Terminal A — API

cd tinyfoodapi && npm run start:dev

# Terminal B — App (primera vez: build nativo)

cd tinyfood && npx expo run:android # solo la primera vez

# Siguientes veces:

cd tinyfood && npx expo start

El npx expo run:android solo es necesario una vez por máquina (o cuando cambias dependencias nativas). Después con npx expo start basta y el hot reload funciona normal, como en cualquier proyecto React.
