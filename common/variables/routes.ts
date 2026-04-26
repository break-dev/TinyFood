export const routes = {
  auth: "/(public)/auth",
  home: "/(private)/home",
  index: "/",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
