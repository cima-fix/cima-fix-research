import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/layout/AppShell.tsx";
import { NotFound } from "./components/layout/NotFound.tsx";
import { LandingPage } from "./pages/LandingPage.tsx";
import { ExpertInterviewsPage } from "./features/expert-interviews/ExpertInterviewsPage.tsx";
import { ExpertInterviewDetailPage } from "./features/expert-interviews/ExpertInterviewDetailPage.tsx";
import { NeedfindingPage } from "./features/needfinding/NeedfindingPage.tsx";
import { ExtremeUsersPage } from "./features/extreme-users/ExtremeUserPage.tsx";
import { ExtremeUserDetailPage } from "./features/extreme-users/ExtremeUserDetailPage.tsx";
import { EmpathyMapPage } from "./features/empathy-map/EmpathyMapPage.tsx";
import { RoperDynagramPage } from "./features/roper-dynagram/RoperDynagramPage.tsx";
import { RequirementsMappingPage } from "./features/requirements-mapping/RequirementsMappingPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "expert-interviews", element: <ExpertInterviewsPage /> },
      { path: "expert-interviews/:id", element: <ExpertInterviewDetailPage /> },
      { path: "needfinding", element: <NeedfindingPage /> },
      { path: "extreme-users", element: <ExtremeUsersPage /> },
      { path: "extreme-users/:id", element: <ExtremeUserDetailPage /> },
      { path: "empathy-map", element: <EmpathyMapPage /> },
      { path: "roper-dynagram", element: <RoperDynagramPage /> },
      { path: "requirements-mapping", element: <RequirementsMappingPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
