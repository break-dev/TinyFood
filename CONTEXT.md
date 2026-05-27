TinyFood — Frontend

Para IA del IDE: Lee este documento completo antes de generar o sugerir cualquier código. Contiene las reglas, arquitectura y convenciones estrictas de este proyecto.

1. Contexto del Negocio
TinyFood es un asistente inteligente diseñado para combatir el desperdicio de alimentos y mejorar la salud nutricional del hogar. La app utiliza IA para gestionar el inventario de la despensa y sugerir recetas personalizadas basadas en lo que el usuario ya tiene, sus alergias y sus metas físicas.

Flujo Crítico de Autenticación
1. Inicio Inteligente: El orquestador decide si enviar al usuario al Dashboard o al Login según la sesión de Supabase.
2. Login Nativo: Uso de Google Sign-In nativo para una experiencia fluida.
3. Verificación de Perfil: Si el usuario no tiene datos físicos registrados en la API, es forzado a completar el registro multi-paso.

2. Stack Tecnológico Moderno
- Núcleo: Expo / React Native
- Navegación: Expo Router
- Estilos: NativeWind (Tailwind)
- Estado: Zustand
- Backend: Socket.IO Client
- Auth: Supabase / Google
- Listas: Shopify FlashList
- Animaciones: Moti / Reanimated
- UI Kit: Bottom Sheet / Toast
- Multimedia: Expo Image Picker
- Calendario: React Native Calendars

3. Arquitectura y Reglas de Oro
El proyecto sigue una arquitectura Modular y Orientada a Capas, optimizada para la legibilidad y el mantenimiento a largo plazo.

Estructura de Carpetas
- app/: Capa de ruteo. Contiene layouts y rutas públicas/privadas.
- modules/: Capa de dominio. Cada carpeta (auth, despensa, perfil) es un módulo independiente.
  - presentation/: Pantallas y componentes visuales. Prohibido usar lógica compleja aquí.
  - logic/: Hooks personalizados (use...) que actúan como Controladores. Aquí reside la lógica.
  - service/: Llamadas a la API/Sockets.
- common/: Recursos compartidos (configs, stores globales, utils).

Convenciones Estrictas (Obligatorio)
1. Text Components: No uses Text de react-native directamente. Importa como import { Text as Text } from "react-native" para evitar colisiones y asegurar el uso de fuentes personalizadas.
2. Safe Areas: No uses SafeAreaView. Está deprecado en versiones recientes de RN. Usa el hook useSafeAreaInsets() y aplica el padding manualmente a un View para mayor control.
3. Haptics: Cada acción importante (botones, éxito de formularios, errores) debe incluir expo-haptics para mejorar el feedback táctil.
4. Estilos: Solo usa clases de Tailwind (className). El uso de StyleSheet.create está prohibido a menos que sea estrictamente necesario para animaciones complejas de Reanimated.
5. Tipado: Todas las interfaces de la API deben seguir el patrón REQ_Nombre para peticiones y RES_Nombre para respuestas.

4. Componentes Comunes y Utilidades (common/)
Componentes de Presentación Compartidos (common/presentation/components/)
- ModalSheet: Contenedor de hojas modales basado en BottomSheetModal de @gorhom/bottom-sheet.
- ModalEstandar: Ventana de diálogo y confirmación premium animada mediante Moti.
- ModernCalendar: Selector de calendario personalizado basado en react-native-calendars configurado al idioma español.

Utilidades Compartidas (common/utils/)
Centraliza metadatos y lógica genérica de soporte para toda la aplicación:
- enums/: EstadoComida, Genero, ObjetivoFisico.
- functions/: getDias / getMeses, makeApiResponse.
- variables/: alergias.ts, dietas.ts, condiciones-medicas.ts, routes.ts, etc.

5. Diseño y Experiencia de Usuario (UX)
Para lograr una sensación Premium, seguimos estas directrices:
- Micro-animaciones: Uso constante de MotiView para entradas de elementos y estados de carga.
- Feedback Visual: Implementación de react-native-toast-message para notificaciones de sistema.
- Skeleton Loaders: Evitar indicadores de carga genéricos; preferir skeletons o animaciones temáticas.
- Teclado: Uso de KeyboardAvoidingView y cierres de teclado automáticos para que la interacción se siente nativa y no "webby".

6. Regla Crítica: Prevención de Lag y Duplicación en Inputs
REGLA OBLIGATORIA DE DESARROLLO: Todo input de texto (TextInput) que involucre escritura rápida debe implementarse obligatoriamente como Input No Controlado (Uncontrolled Input) para evitar el bug nativo de Android que duplica letras y eliminar por completo el lag de pulsaciones.

Directrices estrictas para crear inputs:
1. NUNCA enlacés la propiedad value a un estado reactivo de cambio por pulsación (value={state}).
2. Usa defaultValue para inicializar el valor del input cuando se monte o cuando cambien los datos iniciales.
3. NO actualices estados del componente padre en cada pulsación.
4. Patrón 1: Mutación Directa de Objetos (Hojas de edición del Perfil):
   Muta la propiedad del objeto en el callback de forma directa sin llamar a la función que actualiza el estado.
5. Patrón 2: Referencias Locales (useRef) e Hilo Nativo (Formularios y Tags):
   Para inputs independientes o de texto transitorio, usa un useRef para almacenar el valor typed y otro ref para el input nativo. Si necesitas limpiar el input después de una acción, actualiza el input nativo directamente.

7. Flujo de Carga de Imágenes (Avatar / Perfil)
Para gestionar de forma limpia y eficiente la selección y subida de fotos de perfil desde el dispositivo:
1. Selección de Imagen Local (expo-image-picker).
2. Transporte base64 en Payload de Gateway.
3. Procesamiento y Mimetype en el Servidor (API).
4. Almacenamiento Persistente (Supabase Storage).

8. Comunicación y API
Protocolo Socket.IO
Toda la comunicación con la API se realiza a través de SocketService, que envuelve las emisiones en Promesas con timeouts de 10 segundos.

Variables de Entorno (.env)
- EXPO_PUBLIC_SOCKET_URL: URL de la API.
- EXPO_PUBLIC_SUPABASE_URL/KEY: Credenciales de Supabase.
- EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: Client ID para autenticación.

9. Generación de APK y Builds Natos
Este proyecto utiliza EAS Build para generar binarios instalables.

google-services.json (Obligatorio para builds nativos)
El archivo google-services.json es requerido por el plugin @react-native-google-signin/google-signin para compilar cualquier build nativo (preview o production).

Variables de Entorno en EAS Builds (Crítico)
El archivo .env solo funciona en desarrollo local. Las variables EXPO_PUBLIC_* deben estar declaradas en eas.json bajo el perfil correspondiente para ser tomadas en cuenta en builds con eas.

10. Comandos y Ejecución
- npm install
- npm run android
- Iniciar con Dev Client: npx expo start --dev-client
- Generar APK: eas build --profile preview --platform android
