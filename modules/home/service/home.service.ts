import { supabase } from "../../../common/config/supabase.config";

export class HomeService {
  static async logout(): Promise<void> {
    await supabase.auth.signOut();
  }
}
