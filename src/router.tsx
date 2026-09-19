import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/layout/AppShell.tsx";
import { NotFound } from "./components/layout/NotFound.tsx";
import { LandingPage } from "./pages/LandingPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);