import { supabase } from "../../../common/config/supabase.config";

export class despensaService {
  static async logout(): Promise<void> {
    await supabase.auth.signOut();
  }
}
