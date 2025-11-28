import type { RouteObject } from "react-router";
import { lazy } from "react";

export default [
  {
    path: "/",
    Component: lazy(() => import("@/pages/Layout")),
    children: [
      {
        index: true,
        Component: lazy(() => import("@/pages/app")),
      },
    ],
  },
] satisfies RouteObject[];
