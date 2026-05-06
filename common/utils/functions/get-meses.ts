import { meses, mesesShort } from "../variables/meses";

export const getMeses = (short: boolean = false) => {
  if (short) return mesesShort;
  return meses;
};
