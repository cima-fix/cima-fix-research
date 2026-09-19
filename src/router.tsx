import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/layout/AppShell.tsx";
import { NotFound } from "./components/layout/NotFound.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <NotFound />,
    children: [{ path: "*", element: <NotFound /> }],
  },
]);
