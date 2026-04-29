export const routes = {
  auth: "/(public)/auth",
  despensa: "/(private)/despensa",
  about: "/(private)/about",
  perfil: "/(private)/perfil",
  index: "/",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
