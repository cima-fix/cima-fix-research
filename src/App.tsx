import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { importDatasetOnStartup } from "./lib/import.ts";
import { router } from "./router.tsx";

function App() {
  useEffect(() => {
    void importDatasetOnStartup();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;