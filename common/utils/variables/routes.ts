export const routes = {
  auth: "/(public)/auth",
  home: "/(private)/home",
  about: "/(private)/about",
  perfil: "/(private)/perfil",
  index: "/",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
