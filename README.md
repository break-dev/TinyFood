# TinyFood — Frontend

> **Para IA del IDE:** Lee este documento completo antes de generar o sugerir cualquier código. Contiene las reglas, arquitectura y convenciones de este proyecto.

## 1. Contexto del Negocio

**Problema:** Los usuarios desperdician comida por no llevar un control de su despensa y no saben qué cocinar con lo que tienen, especialmente considerando restricciones médicas o nutricionales.

**Solución:** Aplicación móvil que gestiona la despensa del hogar con ayuda de IA:

- El usuario fotografía sus alimentos → la IA los identifica y estima su fecha de caducidad.
- La app alerta antes de que los alimentos se estropeen.
- Sugiere recetas basadas en el inventario actual y las restricciones del usuario.

**Happy Path de Autenticación:**

```
Usuario abre app
  → Redirección inteligente (Index) según sesión
    → Login con Google Nativo
      → Verificación en API (¿Existe perfil?)
        → SI: Dashboard (Home)
        → NO: Formulario de Registro Multi-paso (Peso, Talla, Alergias)
```

---

## 2. Stack Tecnológico

| Herramienta             | Versión  | Uso                                       |
| ----------------------- | -------- | ----------------------------------------- |
| Expo                    | ~54.0.33 | SDK de desarrollo nativo                  |
| React Native            | 0.81.5   | Framework base móvil                      |
| TypeScript              | ~5.9.2   | **Obligatorio** en todo el proyecto       |
| Expo Router             | ~6.0.23  | Navegación basada en carpetas             |
| NativeWind              | ^4.2.3   | Estilos con clases Tailwind               |
| Zustand                 | ^4.5.2   | Gestión de estado global (AuthStore)      |
| Socket.IO Client        | ^4.8.1   | Comunicación en tiempo real con la API    |
| Supabase Auth           | ^2.62.2  | Gestión de sesiones y OAuth               |
| Google Sign-In          | ^13.1.0  | Autenticación Nativa (Android/iOS)        |
| React Native Reanimated | ~4.1.1   | Animaciones fluidas y micro-interacciones |

---

## 3. Arquitectura Modular (Obligatoria)

Mantenemos una estructura estrictamente modular en `modules/`:

```
modules/
  auth/
    presentation/ ← Pantallas de Login y Registro (Multi-paso)
    logic/        ← Hooks (useAutenticar, useRegistrar)
    service/      ← AuthService (Google Nativo, Sockets)
  home/
    presentation/ ← Dashboard Principal
    logic/        ← useHome, useLogout
```

### 3.1 Gestión de Estado Global (`common/stores`)

Usamos **Zustand** para evitar el "prop drilling". El `auth.store.ts` es la fuente de verdad:

- `usuario`: Objeto con el perfil completo de la base de datos.
- `token`: JWT activo de Supabase.
- `isInitialized`: Flag para evitar parpadeos durante la carga inicial.

---

## 4. Estructura de Navegación (Expo Router)

La app utiliza grupos de rutas para separar el acceso público del privado:

```
app/
  index.tsx       ← Punto de entrada. Decide si ir a Home o Auth.
  _layout.tsx     ← Root Layout. Gestiona onAuthStateChange de Supabase.
  (public)/
    _layout.tsx   ← Protege rutas públicas. Redirige a Home si hay usuario.
    auth.tsx      ← Pantalla de Login (Google).
    register.tsx  ← Formulario de registro (Peso, Talla, Salud).
  (private)/
    _layout.tsx   ← Protege rutas privadas. Redirige a Auth si no hay usuario.
    home.tsx      ← Dashboard Principal.
```

---

## 5. Lógica de Autenticación y Registro

### 5.1 Flujo de Inicio de Sesión (`useAutenticar.ts`)

1. Se invoca `AuthService.authWithGoogle()`.
2. Se obtiene el ID Token de Google y se inicia sesión en Supabase.
3. Se emite un evento Socket `auth:autenticar` a la API.
4. Si la API responde `USER_NOT_FOUND`, se navega a `/register`.

### 5.2 Registro Detallado (`useRegistrar.ts`)

1. Formulario de 3 pasos: Físico (Peso/Talla) -> Actividad -> Salud (Alergias).
2. Los campos de texto (Alergias/Preferencias) se convierten de **String separado por comas** a **Array (`string[]`)** antes de enviarse a la API.

---

## 6. Comunicación con la API (WebSockets)

- **SocketService:** Envoltura sobre Socket.io que maneja promesas y timeouts de 10s.
- **Protocolo:** Todas las peticiones al servidor son vía `socket.emit` con un callback de respuesta (`ack`).
- **Autenticación:** El token se envía en el `handshake.auth` o como propiedad `token` en el payload.

---

## 7. Convenciones de Desarrollo

1.  **Estilos:** Solo clases de **Tailwind** (`className`). Prohibido `StyleSheet.create`.
2.  **Rutas:** Usar el objeto `routes` de `@/common/utils/variables/routes` para navegar.
3.  **Tipado:** Todas las respuestas de la API deben estar tipadas como `RES_Nombre`.
4.  **Haptics:** Usar `expo-haptics` para dar feedback táctil en acciones importantes (botones, éxito/error).

---

## 8. Ejecución Local

1. `npm install`
2. Configurar `.env` con `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SOCKET_URL`, etc.
3. `npx expo start --dev-client` (Requiere build nativo previo en el dispositivo).
