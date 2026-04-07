import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Search } from "./pages/search";
import { PropertyDetails } from "./pages/property-details";
import { PublishProperty } from "./pages/publish-property";
import { Dashboard } from "./pages/dashboard";
import { Profile } from "./pages/profile";
import { Chat } from "./pages/chat";
import { NotFound } from "./pages/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "search", Component: Search },
      { path: "property/:id", Component: PropertyDetails },
      { path: "publish", Component: PublishProperty },
      { path: "dashboard", Component: Dashboard },
      { path: "profile", Component: Profile },
      { path: "chat", Component: Chat },
      { path: "*", Component: NotFound },
    ],
  },
]);
