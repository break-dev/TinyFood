import { dias, diasShort } from "../variables/dias";

export const getDias = (short: boolean = false) => {
  if (short) return diasShort;
  return dias;
};
