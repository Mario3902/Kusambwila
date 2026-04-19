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
import LandlordDocuments from "./pages/landlord-documents";
import { NotFound } from "./pages/not-found";
import { AdminLayout } from "./admin/components/AdminLayout";
import { AdminDashboard } from "./admin/pages/AdminDashboard";
import { AdminProperties } from "./admin/pages/AdminProperties";
import { AdminUsers } from "./admin/pages/AdminUsers";
import { AdminFinance } from "./admin/pages/AdminFinance";
import { AdminSettings } from "./admin/pages/AdminSettings";
import AdminDocuments from "./admin/pages/documents";

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
      { path: "documents", Component: LandlordDocuments },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "properties", Component: AdminProperties },
      { path: "users", Component: AdminUsers },
      { path: "finance", Component: AdminFinance },
      { path: "settings", Component: AdminSettings },
      { path: "documents", Component: AdminDocuments },
    ],
  },
]);
