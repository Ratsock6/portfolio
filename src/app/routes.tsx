import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Projects from "../pages/Projects";
import DevProjects from "../pages/DevProjects";
import NotFound from "../pages/NotFound";
import RouteError from "../pages/RouteError";
import ProjectDetail from "../pages/ProjectDetail";
import DevProjectDetail from "../pages/DevProjectDetail";
import Chess from "../pages/interests/Chess";
import F1 from "../pages/interests/F1";
import TableTennis from "../pages/interests/TableTennis";
import Gaming from "../pages/interests/Gaming";
import Travel from "../pages/interests/Travel";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "projects", element: <Projects /> },
      { path: "projects/:slug", element: <ProjectDetail /> },
      { path: "dev-projects", element: <DevProjects /> },
      { path: "dev-projects/:slug", element: <DevProjectDetail /> },
      { path: "interests/chess", element: <Chess /> },
      { path: "interests/f1", element: <F1 /> },
      { path: "interests/table-tennis", element: <TableTennis /> },
      { path: "interests/gaming", element: <Gaming /> },
      { path: "interests/travel", element: <Travel /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);