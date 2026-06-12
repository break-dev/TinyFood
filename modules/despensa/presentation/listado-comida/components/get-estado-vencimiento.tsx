import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  LucideIcon,
} from "lucide-react-native";

export interface IEstadoVencimientoUI {
  color: string;
  label: string;
  Icon: LucideIcon;
}

export const getEstadoVencimiento = (
  fechaVencimiento?: string | Date | null,
  diasAviso: number = 3,
): IEstadoVencimientoUI => {
  if (!fechaVencimiento)
    return { color: "bg-blue-500", label: "Sin fecha", Icon: HelpCircle };
  
  const dateStr = typeof fechaVencimiento === "string" ? fechaVencimiento : fechaVencimiento.toISOString();
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match)
    return { color: "bg-blue-500", label: "Sin fecha", Icon: HelpCircle };
    
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);
  
  const vencimiento = new Date(year, month, day);
  const hoy = new Date();
  vencimiento.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);
  
  const diffTime = vencimiento.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0)
    return { color: "bg-red-500", label: "Vencido", Icon: AlertTriangle };
  if (diffDays <= diasAviso)
    return {
      color: "bg-orange-500",
      label: `Vence en ${diffDays}d`,
      Icon: AlertTriangle,
    };
  return {
    color: "bg-emerald-500",
    label: "Fresco",
    Icon: CheckCircle2,
  };
};
