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

| Categoría       | Herramienta           | Versión         | Uso                                                 |
| :-------------- | :-------------------- | :-------------- | :-------------------------------------------------- |
| **Núcleo**      | Expo / React Native   | SDK 54 / 0.81.5 | Base del desarrollo nativo.                         |
| **Navegación**  | Expo Router           | ~6.0.23         | Navegación basada en archivos (File-based routing). |
| **Estilos**     | NativeWind (Tailwind) | ^4.2.3          | Estilos declarativos y diseño consistente.          |
| **Estado**      | Zustand               | ^5.0.12         | Gestión de estado global ligera y escalable.        |
| **Backend**     | Socket.IO Client      | ^4.8.3          | Comunicación en tiempo real y bidireccional.        |
| **Auth**        | Supabase / Google     | ^2.103.0        | Gestión de identidad y persistencia de sesión.      |
| **Listas**      | Shopify FlashList     | 2.0.2           | Listado de alto rendimiento (reemplaza FlatList).   |
| **Animaciones** | Moti / Reanimated     | ~4.1.1          | Micro-interacciones y transiciones fluidas.         |
| **UI Kit**      | Bottom Sheet / Toast  | ^5.2.10         | Componentes de interacción premium.                 |
| **Multimedia**  | Expo Image Picker     | ~17.0.11        | Selección y acceso local a imágenes/cámara.         |
| **Calendario**  | React Native Calendars| ^1.1314.0       | Calendario interactivo localizado para la despensa. |

---

## 3. Arquitectura y Reglas de Oro 🏗️

El proyecto sigue una arquitectura **Modular y Orientada a Capas**, optimizada para la legibilidad y el mantenimiento a largo plazo.

### 3.1 Estructura de Carpetas

- `app/`: Capa de ruteo. Contiene layouts y rutas públicas/privadas.
- `modules/`: Capa de dominio. Cada carpeta (`auth`, `despensa`, `perfil`) es un módulo independiente.
  - `presentation/`: Pantallas y componentes visuales. **Prohibido** usar lógica compleja aquí.
  - `logic/`: Hooks personalizados (`use...`) que actúan como **Controladores**. Aquí reside la lógica.
  - `service/`: Llamadas a la API/Sockets.
- `common/`: Recursos compartidos (configs, stores globales, utils).

### 3.2 Convenciones Estrictas (Obligatorio)

1.  **Text Components:** No uses `Text` de `react-native` directamente. Importa como `import { Text as Text } from "react-native"` para evitar colisiones y asegurar el uso de fuentes personalizadas.
2.  **Safe Areas:** **No uses `<SafeAreaView />`**. Está deprecado en versiones recientes de RN. Usa el hook `useSafeAreaInsets()` y aplica el padding manualmente a un `View` para mayor control.
3.  **Haptics:** Cada acción importante (botones, éxito de formularios, errores) debe incluir `expo-haptics` para mejorar el feedback táctil.
4.  **Estilos:** Solo usa clases de **Tailwind** (`className`). El uso de `StyleSheet.create` está prohibido a menos que sea estrictamente necesario para animaciones complejas de Reanimated.
5.  **Tipado:** Todas las interfaces de la API deben seguir el patrón `REQ_Nombre` para peticiones y `RES_Nombre` para respuestas.

---

## 4. Diseño y Experiencia de Usuario (UX) ✨

Para lograr una sensación **Premium**, seguimos estas directrices:

- **Micro-animaciones:** Uso constante de `MotiView` para entradas de elementos y estados de carga.
- **Feedback Visual:** Implementación de `react-native-toast-message` para notificaciones de sistema.
- **Skeleton Loaders:** Evitar indicadores de carga genéricos; preferir skeletons o animaciones temáticas.
- **Teclado:** Uso de `KeyboardAvoidingView` y cierres de teclado automáticos para que la interacción se sienta nativa y no "webby".

---

## 5. Comunicación y API 🔌

### Protocolo Socket.IO

Toda la comunicación con la API se realiza a través de `SocketService`, que envuelve las emisiones en Promesas con timeouts de 10 segundos.

### Variables de Entorno (`.env`)

- `EXPO_PUBLIC_SOCKET_URL`: URL de la API.
  - **Producción:** `https://tinyfoodapi.onrender.com`
  - **Local:** Tu IP local (ej. `http://192.168.100.XX:3000`) si la API no está en la nube.
- `EXPO_PUBLIC_SUPABASE_URL/KEY`: Credenciales de Supabase.
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`: Client ID para autenticación.

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
2.  **SKILLS:** `npx skills install`
3.  **Configurar:** Crear `.env` basado en `env.example`.
4.  **Correr:** `npx expo start --dev-client`
    - _Nota:_ Al usar librerías nativas, **debes** usar un Development Build o el APK generado para probar todas las funciones (especialmente Auth y Haptics).

---

## 8. Componentes Comunes y Utilidades (`common/`) 🏗️

### 8.1 Componentes de Presentación Compartidos (`common/presentation/components/`)

- **`ModalSheet`**: Contenedor de hojas modales basado en `BottomSheetModal` de `@gorhom/bottom-sheet`.
  - **Snap Points**: Por defecto configurado en `["94%"]` para cubrir casi la totalidad de la pantalla, evitando colisiones con el notch superior.
  - **Gestión de Teclado**: Cuenta con `keyboardBehavior="fillParent"` y `keyboardBlurBehavior="restore"` para asegurar que los campos inferiores no queden ocultos tras el teclado virtual.
  - **Modo Scroll**: Soporta la propiedad `scrollable?: boolean` (por defecto `true`). Al configurarse en `false`, permite diseñar vistas complejas con cabeceras y pies de página fijos (_sticky_) integrados en lugar de hacer scroll en toda la modal.
- **`ModalEstandar`**: Ventana de diálogo y confirmación premium animada mediante `Moti`.
  - Soporta tipos semánticos (`info`, `success`, `warning`, `danger`) con paletas de colores armónicas y automatizadas.
  - Acepta funciones callbacks `onConfirm` y `onClose` para flujos transaccionales críticos (cerrar sesión, eliminaciones, advertencias).
- **`ModernCalendar`**: Selector de calendario personalizado basado en `react-native-calendars` configurado al idioma español.
  - Incluye accesos directos (_dropdowns_ animados) para cambiar rápidamente el mes y el año de forma ultra-rápida y optimizada.

### 8.2 Utilidades Compartidas (`common/utils/`)

Centraliza metadatos y lógica genérica de soporte para toda la aplicación:

- **`enums/`**:
  - `EstadoComida`: Estados posibles de los alimentos (`por consumir`, `consumido`, `vencido`).
  - `Genero`: Opciones de género del perfil (`masculino`, `femenino`, `otro`).
  - `ObjetivoFisico`: Metas de salud del usuario (`mantener`, `perder peso`, `ganar peso`).
- **`functions/`**:
  - `getDias` / `getMeses`: Formateo de fechas localizado al español.
  - `makeApiResponse`: Cascarón homogeneizado para respuestas del backend.
- **`variables/`**:
  - Contiene arrays constantes como `alergias.ts`, `dietas.ts`, `condiciones-medicas.ts`, `routes.ts`, etc., utilizados para sugerencias dinámicas.

---

## 9. Regla Crítica: Prevención de Lag y Duplicación en Inputs ⌨️

> [!IMPORTANT]
> **REGLA OBLIGATORIA DE DESARROLLO**: Todo input de texto (`TextInput`) que involucre escritura rápida **debe** implementarse obligatoriamente como **Input No Controlado (Uncontrolled Input)** para evitar el bug nativo de Android que duplica letras (por ejemplo, escribir _"Pap"_ y que resulte en _"PapPappapa"_) y eliminar por completo el lag de pulsaciones.

### ¿Por qué ocurre esto en Android?

En React Native, enlazar la propiedad `value` de un input a un estado de React que se actualiza en cada pulsación (`onChangeText`) fuerza la sincronización de hilos (JS vs Nativo) en cada tecla presionada. Si el hilo de JS está ocupado re-renderizando componentes pesados o layouts con animaciones, el input nativo se desincroniza, provocando saltos de cursor y caracteres duplicados.

### Directrices estrictas para crear inputs:

1.  **NUNCA enlacés la propiedad `value`** a un estado reactivo de cambio por pulsación (`value={state}`).
2.  **Usa `defaultValue`** para inicializar el valor del input cuando se monte o cuando cambien los datos iniciales (ej. `defaultValue={data.nombre}`).
3.  **NO actualices estados del componente padre en cada pulsación** (ej. evita hacer `setData({ ...data, nombre: t })` en `onChangeText`). Esto previene ciclos innecesarios de re-renderizado.
4.  **Patrón 1: Mutación Directa de Objetos (Hojas de edición del Perfil)**:
    Si los datos de texto están encapsulados en un objeto en el estado (como `formData`), muta la propiedad del objeto en el callback de forma directa sin llamar a la función que actualiza el estado:
    ```tsx
    onChangeText={(text) => { data.nombre = text; }}
    ```
    Dado que el objeto se pasa por referencia, cuando el usuario presione el botón "Guardar", la función leerá las propiedades modificadas del objeto original de forma correcta y guardará los cambios sin haber relanzado re-renders en la pantalla mientras escribía.
5.  **Patrón 2: Referencias Locales (`useRef`) e Hilo Nativo (Formularios y Tags)**:
    Para inputs independientes o de texto transitorio, usa un `useRef` para almacenar el valor typed y otro ref para el input nativo. Si necesitas limpiar el input después de una acción (como agregar un hashtag o badge), actualiza el input nativo directamente:

    ```tsx
    const inputRef = useRef<TextInput>(null);
    const textRef = useRef("");

    const addTag = () => {
      const val = textRef.current.trim();
      if (val) {
        // Lógica de agregado...
      }
      textRef.current = "";
      inputRef.current?.setNativeProps({ text: "" }); // Limpieza directa e instantánea
    };

    return (
      <TextInput
        ref={inputRef}
        onChangeText={(t) => {
          textRef.current = t;
        }}
        onSubmitEditing={addTag}
      />
    );
    ```

---

## 10. Flujo de Carga de Imágenes (Avatar / Perfil) 📸

Para gestionar de forma limpia y eficiente la selección y subida de fotos de perfil desde el dispositivo:

1.  **Selección de Imagen Local (`expo-image-picker`)**:
    *   Utilizamos `ImagePicker.launchImageLibraryAsync` configurado con `allowsEditing: true`, relación de aspecto `[1, 1]` para cortes cuadrados, calidad optimizada de `0.8` y habilitando la devolución de datos en base64 (`base64: true`).
    *   Este método solicita de manera nativa los permisos de la galería del dispositivo.
2.  **Transporte base64 en Payload de Gateway**:
    *   La imagen local seleccionada se codifica como una cadena base64 en la propiedad `foto_b64` de la petición.
    *   Esto elimina la complejidad de enviar archivos multipart a través de Socket.IO, encapsulando toda la carga en el mismo evento del socket.
3.  **Procesamiento y Mimetype en el Servidor (API)**:
    *   El backend NestJS recibe `foto_b64`, calcula automáticamente el mimetype correcto leyendo los magic bytes del buffer de datos base64 (usando `file-type`).
    *   Valida que la imagen pertenezca a los tipos permitidos (`image/jpeg`, `image/png`, `image/webp`, `image/avif`).
4.  **Almacenamiento Persistente (Supabase Storage)**:
    *   La API sube el buffer resultante al bucket público `TinyBucket` de Supabase Storage mediante `SupabaseStorageService`.
    *   Genera un nombre UUID único para el archivo y devuelve la URL pública del recurso, la cual se guarda en PostgreSQL y se actualiza en el estado local de Zustand del cliente (`setUser`).

---

## 11. Comandos Útiles 🛠️

*   **Instalar dependencias**:
    ```bash
    npm install
    ```
*   **Correr en Android**:
    ```bash
    npm run android
    ```
*   **Correr en iOS**:
    ```bash
    npm run ios
    ```
*   **Iniciar con Dev Client (Recomendado)**:
    ```bash
    npx expo start --dev-client
    ```
---

> **Mantenimiento:** Este README debe actualizarse cada vez que se agregue una nueva dependencia global o se cambie un flujo arquitectónico mayor.
