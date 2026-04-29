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
        → SI: Dashboard (Despensa)
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

## 3. Arquitectura y Estructura de Carpetas

El proyecto sigue una arquitectura **Modular y Orientada a Capas** para asegurar que el código sea escalable, testeable y fácil de mantener.

### 3.1 Estructura Principal

- `app/`: **Capa de Ruteo (Expo Router)**.
  - `(public)/`: Rutas accesibles sin autenticación (Login, Registro).
  - `(private)/`: Rutas protegidas que requieren sesión activa.
  - `index.tsx`: Orquestador inicial que decide el flujo de navegación.
- `modules/`: **Capa de Funcionalidades (Features)**. Cada carpeta representa un dominio del negocio.
  - `presentation/`: Componentes visuales y pantallas. **Regla:** No deben contener lógica compleja ni acceder a stores directamente.
  - `logic/`: Hooks personalizados (`use...`) que actúan como controladores. Orquestan servicios y actualizan el estado global.
  - `service/`: Clases o funciones que realizan peticiones al exterior (Sockets/API). **Regla:** Las interfaces de peticiones deben ir en `nombre.requests.ts` y las respuestas en `nombre.responses.ts`. Los enums deben importarse de `common/utils/enums`.
- `common/`: **Capa Transversal (Shared)**.
  - `config/`: Inicialización de SDKs (Supabase, Socket.io).
  - `stores/`: Definición de estados globales con **Zustand**.
  - `logic/`: Hooks de orquestación compartidos (ej. `useAuthState`).
  - `service/`: Servicios globales (ej. `SocketService` para manejo de reconexiones).
  - `utils/`:
    - `variables/`: Constantes de diseño, rutas, y strings.
    - `functions/`: Helpers puros y formateadores.
- `assets/`: Recursos estáticos (imágenes, fuentes, sonidos).

### 3.2 Convenciones y Reglas de Oro

1.  **Modularidad Estricta:** Un módulo no debe importar archivos de la carpeta `presentation` de otro módulo. La comunicación entre módulos se hace a través de servicios o stores en `common`.
2.  **Hooks de Lógica como Controladores:** Si un componente necesita datos de un store, debe pedírselos a un hook en la carpeta `logic`. Ejemplo:
    - ❌ `const { user } = useAuthStore();` (En un componente de UI)
    - ✅ `const { user } = useAuthState();` (Donde el hook encapsula el acceso al store)
3.  **Estilos Declarativos:** Usamos exclusivamente **NativeWind** (Tailwind CSS). Esto permite un diseño consistente y rápido sin la verbosidad de `StyleSheet`.
4.  **Tipado Total:** Cada respuesta de socket o función debe tener su interfaz definida en el archivo correspondiente para evitar el uso de `any`.

---

## 4. Estructura de Navegación (Expo Router)

La app utiliza grupos de rutas para separar el acceso público del privado:

```
app/
  index.tsx       ← Punto de entrada. Decide si ir a despensa o Auth.
  _layout.tsx     ← Root Layout. Gestiona onAuthStateChange de Supabase.
  (public)/
    _layout.tsx   ← Protege rutas públicas. Redirige a despensa si hay usuario.
    auth.tsx      ← Pantalla de Login (Google).
    register.tsx  ← Formulario de registro (Peso, Talla, Salud).
  (private)/
    _layout.tsx   ← Protege rutas privadas. Redirige a Auth si no hay usuario.
    despensa.tsx      ← Dashboard Principal (Módulo Despensa).
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
2. Configurar `.env` con las variables necesarias:
   - `EXPO_PUBLIC_SUPABASE_URL` y `KEY`: Desde el dashboard de Supabase.
   - `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`: Desde Google Cloud Console (ID de cliente web para OAuth).
   - `EXPO_PUBLIC_SOCKET_URL`: Tu IP local (ver sección 9).
3. `npx expo start --dev-client` (Requiere build nativo previo en el dispositivo).

---

## 9. Configuración de Red y Sockets

### ¿Por qué no usar `localhost`?

En el desarrollo móvil con Expo/React Native, `localhost` (127.0.0.1) se refiere al **dispositivo móvil o emulador**, no a tu computadora. Para que la app pueda comunicarse con la API ejecutándose en tu PC, debes usar la **dirección IP privada** de tu computadora en la misma red Wi-Fi.

### Cómo obtener tu IP (Mac/Linux)

Corre el siguiente comando en tu terminal:

```bash
ipconfig getifaddr en0
```

O búscalo en _Ajustes del Sistema > Red > Wi-Fi > Detalles_.

### Cómo obtener tu IP (Windows)

```bash
ipconfig
```

Busca la sección "Adaptador de LAN inalámbrica Wi-Fi" y copia la "Dirección IPv4" (ej. `192.168.1.XX`).

### Troubleshooting de Conexión

- **Misma Red:** Asegúrate de que el celular y la PC estén en la misma red Wi-Fi.
- **Firewall:** Si no conecta, verifica que el Firewall de tu OS permita conexiones entrantes en el puerto `3000`.
- **IP Dinámica:** Si reinicias tu router, tu IP podría cambiar y deberás actualizarla en el `.env`.
