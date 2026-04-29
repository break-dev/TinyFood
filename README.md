# TinyFood — Frontend 🥘

> **Para IA del IDE:** Lee este documento completo antes de generar o sugerir cualquier código. Contiene las reglas, arquitectura y convenciones estrictas de este proyecto.

---

## 1. Contexto del Negocio 💡

**TinyFood** es un asistente inteligente diseñado para combatir el desperdicio de alimentos y mejorar la salud nutricional del hogar. La app utiliza IA para gestionar el inventario de la despensa y sugerir recetas personalizadas basadas en lo que el usuario ya tiene, sus alergias y sus metas físicas.

### Flujo Crítico de Autenticación
1.  **Inicio Inteligente:** El orquestador decide si enviar al usuario al Dashboard o al Login según la sesión de Supabase.
2.  **Login Nativo:** Uso de Google Sign-In nativo para una experiencia fluida.
3.  **Verificación de Perfil:** Si el usuario no tiene datos físicos registrados en la API, es forzado a completar el registro multi-paso.

---

## 2. Stack Tecnológico Moderno 🚀

| Categoría | Herramienta | Versión | Uso |
| :--- | :--- | :--- | :--- |
| **Núcleo** | Expo / React Native | SDK 54 / 0.81.5 | Base del desarrollo nativo. |
| **Navegación** | Expo Router | ~6.0.23 | Navegación basada en archivos (File-based routing). |
| **Estilos** | NativeWind (Tailwind) | ^4.2.3 | Estilos declarativos y diseño consistente. |
| **Estado** | Zustand | ^5.0.12 | Gestión de estado global ligera y escalable. |
| **Backend** | Socket.IO Client | ^4.8.3 | Comunicación en tiempo real y bidireccional. |
| **Auth** | Supabase / Google | ^2.103.0 | Gestión de identidad y persistencia de sesión. |
| **Listas** | Shopify FlashList | 2.0.2 | Listado de alto rendimiento (reemplaza FlatList). |
| **Animaciones** | Moti / Reanimated | ~4.1.1 | Micro-interacciones y transiciones fluidas. |
| **UI Kit** | Bottom Sheet / Toast | ^5.2.10 | Componentes de interacción premium. |

---

## 3. Arquitectura y Reglas de Oro 🏗️

El proyecto sigue una arquitectura **Modular y Orientada a Capas**, optimizada para la legibilidad y el mantenimiento a largo plazo.

### 3.1 Estructura de Carpetas
-   `app/`: Capa de ruteo. Contiene layouts y rutas públicas/privadas.
-   `modules/`: Capa de dominio. Cada carpeta (`auth`, `despensa`, `perfil`) es un módulo independiente.
    -   `presentation/`: Pantallas y componentes visuales. **Prohibido** usar lógica compleja aquí.
    -   `logic/`: Hooks personalizados (`use...`) que actúan como **Controladores**. Aquí reside la lógica.
    -   `service/`: Llamadas a la API/Sockets.
-   `common/`: Recursos compartidos (configs, stores globales, utils).

### 3.2 Convenciones Estrictas (Obligatorio)
1.  **Text Components:** No uses `Text` de `react-native` directamente. Importa como `import { Text as RNText } from "react-native"` para evitar colisiones y asegurar el uso de fuentes personalizadas.
2.  **Safe Areas:** **No uses `<SafeAreaView />`**. Está deprecado en versiones recientes de RN. Usa el hook `useSafeAreaInsets()` y aplica el padding manualmente a un `View` para mayor control.
3.  **Haptics:** Cada acción importante (botones, éxito de formularios, errores) debe incluir `expo-haptics` para mejorar el feedback táctil.
4.  **Estilos:** Solo usa clases de **Tailwind** (`className`). El uso de `StyleSheet.create` está prohibido a menos que sea estrictamente necesario para animaciones complejas de Reanimated.
5.  **Tipado:** Todas las interfaces de la API deben seguir el patrón `REQ_Nombre` para peticiones y `RES_Nombre` para respuestas.

---

## 4. Diseño y Experiencia de Usuario (UX) ✨

Para lograr una sensación **Premium**, seguimos estas directrices:
-   **Micro-animaciones:** Uso constante de `MotiView` para entradas de elementos y estados de carga.
-   **Feedback Visual:** Implementación de `react-native-toast-message` para notificaciones de sistema.
-   **Skeleton Loaders:** Evitar indicadores de carga genéricos; preferir skeletons o animaciones temáticas.
-   **Teclado:** Uso de `KeyboardAvoidingView` y cierres de teclado automáticos para que la interacción se sienta nativa y no "webby".

---

## 5. Comunicación y API 🔌

### Protocolo Socket.IO
Toda la comunicación con la API se realiza a través de `SocketService`, que envuelve las emisiones en Promesas con timeouts de 10 segundos.

### Variables de Entorno (`.env`)
-   `EXPO_PUBLIC_SOCKET_URL`: URL de la API.
    -   **Producción:** `https://tinyfoodapi.onrender.com`
    -   **Local:** Tu IP local (ej. `http://192.168.100.XX:3000`) si la API no está en la nube.
-   `EXPO_PUBLIC_SUPABASE_URL/KEY`: Credenciales de Supabase.
-   `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`: Client ID para autenticación.

---

## 6. Generación de APK y Builds Natos 📱

Este proyecto utiliza **EAS Build** para generar binarios instalables.

### 6.1 Proceso de Build (Android APK)
1.  **Comando:** `eas build --profile preview --platform android`
2.  **Perfil Preview:** Genera un archivo `.apk` descargable directamente desde Expo.

### 6.2 Firma y Google Sign-In (Paso Crítico)
Para que el Login de Google funcione en el APK instalado:
1.  Obtén el SHA-1 del build: `eas credentials --platform android` (selecciona perfil `preview`).
2.  Registra ese **SHA-1** y el Package Name (`com.tinyfood.app`) en la **Google Cloud Console**.
3.  Sin este registro, el botón de Google fallará con un "Developer Error".

### 6.3 `google-services.json` (Obligatorio para builds nativos)

> **Síntoma sin este archivo:** la app crashea inmediatamente al abrir el APK, sin ningún mensaje de error. En el dev client no ocurre porque Expo lo maneja internamente.

El archivo `google-services.json` es **requerido por el plugin `@react-native-google-signin/google-signin`** para compilar cualquier build nativo (preview o production). No se obtiene de Google Cloud Console, sino de **Firebase Console**.

**Cómo obtenerlo (primera vez):**
1.  Ve a [console.firebase.google.com](https://console.firebase.google.com) y crea un proyecto conectado al proyecto Cloud existente (`TinyFood`).
2.  Dentro del proyecto Firebase → **Agregar app Android**.
3.  Package name: `com.tinyfood.app`. Agrega el SHA-1 si lo tienes disponible.
4.  Descarga el `google-services.json` y colócalo en la **raíz del proyecto** (junto al `app.json`).
5.  Verifica que `app.json` tenga la referencia (ya está configurado):
    ```json
    "android": {
      "googleServicesFile": "./google-services.json"
    }
    ```

**Nota de seguridad:** `google-services.json` **sí puede subirse a GitHub**. Sus valores son identificadores públicos restringidos por package name y SHA-1, no credenciales secretas.

### 6.4 Variables de Entorno en EAS Builds (Crítico)

> **Síntoma sin esto:** la app crashea al inicio con el error `supabaseUrl is required.` El dev client funciona bien porque ahí sí se lee el `.env` local.

**El problema:** el archivo `.env` **solo funciona en desarrollo local** (con `expo start`). EAS Build no lo lee. Las variables `EXPO_PUBLIC_*` se embeben en el bundle JS en tiempo de compilación, por lo que deben estar declaradas en `eas.json` bajo el perfil correspondiente.

**Solución:** declarar las variables en cada perfil de `eas.json`:

```json
"preview": {
  "android": { "buildType": "apk" },
  "env": {
    "EXPO_PUBLIC_SUPABASE_URL": "...",
    "EXPO_PUBLIC_SUPABASE_KEY": "...",
    "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID": "...",
    "EXPO_PUBLIC_SOCKET_URL": "..."
  }
}
```

> **Importante:** si en el futuro agregas una variable nueva al `.env`, recuerda también agregarla al perfil correspondiente en `eas.json`, de lo contrario el build la ignorará.

---

## 7. Ejecución y Desarrollo 🛠️

1.  **Instalar:** `npm install`
2.  **Configurar:** Crear `.env` basado en `env.example`.
3.  **Correr:** `npx expo start --dev-client`
    -   *Nota:* Al usar librerías nativas, **debes** usar un Development Build o el APK generado para probar todas las funciones (especialmente Auth y Haptics).

---

> **Mantenimiento:** Este README debe actualizarse cada vez que se agregue una nueva dependencia global o se cambie un flujo arquitectónico mayor.
