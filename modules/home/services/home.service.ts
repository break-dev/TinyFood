import { HomeRequest } from "./requests";
import { HomeResponse } from "./responses";

export class HomeService {
  public static async fetchDashboard(
    payload: HomeRequest,
    onComplete?: () => void,
  ): Promise<HomeResponse> {
    try {
      // Mock Response
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        message: "Datos obtenidos",
        data: {
          user: "Demo Admin",
          metrics: [
            { id: "1", title: "Pedidos", value: "1,240", trend: "+14%" },
            { id: "2", title: "Ingresos", value: "$8,400", trend: "+5%" },
            { id: "3", title: "Usuarios Nuevos", value: "34", trend: "-2%" },
          ],
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: "No se pudo obtener la información del panel",
        error: error.message,
      };
    } finally {
      if (onComplete) {
        onComplete();
      }
    }
  }
}
