import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { useConfigStore } from "../../modules/configuracion/store/config.store";

/**
 * Hook centralizado para manejar el tema de la aplicación.
 * Sincroniza la preferencia guardada en Zustand con NativeWind y exporta
 * tokens de estilo reutilizables para el modo claro y oscuro.
 */
export function useAppTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const apariencia = useConfigStore((state) => state.apariencia);

  useEffect(() => {
    const mapTheme = {
      claro: "light",
      oscuro: "dark",
      sistema: "system",
    } as const;
    setColorScheme(mapTheme[apariencia] || "system");
  }, [apariencia, setColorScheme]);

  const isDark = colorScheme === "dark";

  return {
    isDark,
    colorScheme,
    // Clases CSS de Tailwind
    themeBg: isDark ? "bg-neutral-950" : "bg-white",
    themeText: isDark ? "text-gray-50" : "text-gray-900",
    themeSubText: isDark ? "text-neutral-400" : "text-gray-400",
    themeCardBg: isDark ? "bg-neutral-900" : "bg-gray-50",
    themeBorder: isDark ? "border-neutral-800" : "border-gray-100",
    themeDivider: isDark ? "bg-neutral-800" : "bg-gray-100",

    // Colores Hexadecimales (útiles para props como StatusBar, SVG o Lucide Icons)
    iconColor: isDark ? "#f3f4f6" : "#111827",
    subIconColor: isDark ? "#a3a3a3" : "#6b7280",
    dividerColor: isDark ? "rgba(63, 63, 70, 0.5)" : "rgba(229, 231, 235, 0.5)",
    shadowColor: isDark ? "#000000" : "#000000",
    
    // Colores de estilo en bruto
    styleBg: isDark ? "#0a0a0a" : "#ffffff",
    styleCardBg: isDark ? "#171717" : "#f9fafb",
  };
}
