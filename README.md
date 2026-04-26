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
expo start run:android # Construye el proyecto para android, solo se ejecuta la primera vez
expo start --dev-client # Inicia el servidor de desarrollo (Expo Go / simulador)
```

---

## 3. Arquitectura Modular (Obligatoria)

Cada funcionalidad se agrupa en un **módulo** dentro de `modules/`. Cada módulo tiene exactamente 3 capas:

```
modules/
  <nombre-modulo>/
    presentation/ ← Capa Presentation - Componentes de UI, totalmente estáticos, consumen hooks
    logic/ ← Capa Logic - Casos de uso mediante hooks que orquestan estados, validaciones y llamadas a servicios
    services/ ← Capa Service (DTOs + comunicación externa - Solo para casos puntuales, se prioriza el uso de hook para llamar al servicio)
```

### 3.1 Capa Presentation — `presentation/`

- **Responsabilidad:** Renderizado visual únicamente.
- **Regla:** No contiene lógica de negocio ni llamadas directas a servicios.
- Consume únicamente los hooks de la capa Logic.
- Convención de nombre para los screens: `<modulo>.screen.tsx` (ej. `auth.screen.tsx`, `home.screen.tsx`).

**Ejemplo:** `modules/auth/presentation/auth.screen.tsx`

### 3.2 Capa Logic — `logic/`

- **Responsabilidad:** Lógica de negocio del frontend. Orquesta estados, validaciones y llamadas a servicios.
- Implementada mediante React Hooks (`use-<caso de uso>.ts`).
- Es el único punto de contacto entre Presentation y Service.

**Ejemplo actual:** `modules/auth/logic/use-auth.ts`

```typescript
export function useAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    /* orquesta AuthService.authenticate */
  };
  const handleGoogleAuth = async () => {
    /* orquesta Google Sign-In */
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleAuth,
    handleGoogleAuth,
  };
}
```

### 3.3 Capa Service — `service/`

- **Responsabilidad:** Comunicación con la API (WebSockets o HTTP). Define los DTOs de entrada/salida por modulo.
- Estructura por archivo:
  - `<modulo>.service.ts` — Clase con los métodos de comunicación.
  - `<modulo>.requests.ts` — Interfaces/types de los payloads enviados a la API, validados mendiante zod si los datos los introdujo el usuario, si es generado por la app no se valida y queda como interfaz pura.
  - `<modulo>.responses.ts` — Interfaces/types de las respuestas recibidas de la API.

**Ejemplo actual:** `modules/auth/service/auth.service.ts`
**Ejemplo actual:** `modules/auth/service/auth.requests.ts`
**Ejemplo actual:** `modules/auth/service/auth.responses.ts`

```typescript
export interface AuthRequest {
  email?: string;
  password?: string;
}

export interface AuthResponse {
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
  index.tsx     ← Redirect a auth screen (ruta "/")
  (public)
    auth.tsx      ← Pantalla de auth (ruta "/auth")
  (private)
    home.tsx      ← Pantalla principal (ruta "/home")
```

Cada archivo de ruta en `app/` importa el componente de presentación correspondiente desde su módulo:

- `app/(public)/auth.tsx` → renderiza componente del módulo `auth`
- `app/(private)/home.tsx` → renderiza componente del módulo `home`

---

## 5. Módulos Actuales

### `modules/auth`

Gestiona el flujo de autenticación del usuario.

| Archivo                      | Propósito                                          |
| ---------------------------- | -------------------------------------------------- |
| `components/auth.screen.tsx` | UI de auth con google                              |
| `hooks/use-auth.ts`          | Estados y acciones de auth/Google                  |
| `services/auth.service.ts`   | Llamada a autenticación                            |
| `services/auth.requests.ts`  | `AuthRequest { email?, password?, token? }`        |
| `services/auth.responses.ts` | `AuthResponse { success, message, data?, error? }` |

**Flujo:** `AuthScreen` → consume `useAuth` → llama `AuthService.authenticate` → navega a `/home` si `success: true`.

### `modules/home`

Panel principal tras autenticación.

| Archivo                      | Propósito                                                       |
| ---------------------------- | --------------------------------------------------------------- |
| `components/home.screen.tsx` | UI del home                                                     |
| `hooks/use-home.ts`          | Estados y acciones del home                                     |
| `services/home.service.ts`   | Fetch de datos del home                                         |
| `services/home.requests.ts`  | `HomeRequest { page: number }`                                  |
| `services/home.responses.ts` | `HomeResponse { success: boolean, data: any, message: string }` |

### `/common`

Carpeta transversal con componentes, hooks o servicios que son compartidos entre módulos, por ejemplo: cliente WebSocket, contextos globales, servicios de almacenamiento en memoria, etc.

---

## 6. Estilos

- **Motor:** NativeWind v4 (Tailwind CSS para React Native).
- **Configuración:** `tailwind.config.js` + `global.css` (importado en `app/_layout.tsx`).
- **Regla:** Todo estilizado debe hacerse exclusivamente con clases de Tailwind a través de NativeWind (`className="..."`). **No usar `StyleSheet.create` ni estilos inline.**
- **Prettier:** `prettier-plugin-tailwindcss` ordena automáticamente las clases de Tailwind.

---

## 7. Tipado TypeScript

- TypeScript es obligatorio en todos los archivos (`.ts` / `.tsx`).
- Todo payload de entrada y salida de la API debe tener su interfaz en `services/<modulo>.requests.ts` y `services/<modulo>.responses.ts` del módulo correspondiente.
- Nunca usar `any` a menos que sea estrictamente necesario y justificado con comentario.

---

## 8. Convenciones de Código

| Concepto            | Convención                                                       |
| ------------------- | ---------------------------------------------------------------- |
| Nombre de módulo    | `kebab-case` (ej. `pantry`, `user-profile`)                      |
| Hooks               | `use-<caso de uso>.ts`, función exportada `useModulo()`          |
| Componentes (views) | `<component>.tsx`, export default                                |
| Servicios           | `<modulo>.service.ts`, clase con métodos static                  |
| DTOs de entrada     | `<modulo>.requests.ts`, interfaz `REQ_<Nombre de la request>`    |
| DTOs de salida      | `<modulo>.responses.ts`, interfaz `RES_<Nombre de la respuesta>` |
| Pantallas (rutas)   | `app/<pantalla>.tsx`, export sin default                         |
| Common              | `common/`, componentes, hooks o servicios compartidos            |

---

## 9. Variables de Entorno

El archivo `.env` en la raíz del proyecto define:

```env
# URL base de la API (Gateway WebSocket)
API_URL=http://localhost:3000
```

> Expo expone variables de entorno con prefijo `EXPO_PUBLIC_` para acceso desde el cliente. Revisa `expo-constants` para configuración adicional.

---

## EJECUCION

# 1. Clonar y preparar

git clone <repo>
cd TinyFood && npm install

# 2. Copiar los .env

# 3. Construir el proyecto nativamente
npx expo run:android

# 4. Ejecutar
npx expo start --dev-client
