import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/layout/AppShell.tsx";
import { NotFound } from "./components/layout/NotFound.tsx";
import { LandingPage } from "./pages/LandingPage.tsx";
import { ExpertInterviewsPage } from "./features/expert-interviews/ExpertInterviewsPage.tsx";
import { ExpertInterviewDetailPage } from "./features/expert-interviews/ExpertInterviewDetailPage.tsx";
import { ExtremeUsersPage } from "./features/super-expert-interviews/ExtremeUserPage.tsx";
import { ExtremeUserDetailPage } from "./features/super-expert-interviews/ExtremeUserDetailPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "expert-interviews", element: <ExpertInterviewsPage /> },
      { path: "expert-interviews/:id", element: <ExpertInterviewDetailPage /> },
      { path: "extreme-users", element: <ExtremeUsersPage /> },
      { path: "extreme-users/:id", element: <ExtremeUserDetailPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
