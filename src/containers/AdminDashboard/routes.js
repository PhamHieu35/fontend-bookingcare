import { Navigate, useRoutes } from "react-router-domv6";
// layouts
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
//
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardApp from "./pages/DashboardApp";
import Products from "./pages/Products";
import Blog from "./pages/Blog";
import User from "./pages/User";
import NotFound from "./pages/Page404";
import UserRedux from "../../containers/System/Admin/UserRedux";
import ManageDoctor from "../../containers/System/Admin/ManageDoctor";
import ManageSchedule from "../../containers/System/Doctor/ManageSchedule";
import ManageScheduleOneDoctor from "../../containers/System/Doctor/ManageScheduleOneDoctor";
import ManageClinic from "../../containers/System/Clinic/ManageClinic";
import ManageSpecialty from "../../containers/System/Specialty/ManageSpecialty";
import ManagePatient from "../../containers/System/Doctor/ManagePatient";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/admin-dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "app", element: <DashboardApp /> },
        { path: "user", element: <UserRedux /> }, //quan ly user
        { path: "manage-doctor", element: <ManageDoctor /> }, //quan ly bac si
        { path: "manage-schedule", element: <ManageSchedule /> }, //quan ly ke hoach kham benh bac si
        { path: "manage-clinic", element: <ManageClinic /> }, //quan ly phong kham
        { path: "manage-specialty", element: <ManageSpecialty /> }, //quan ly chuyen khoa
        // { path: "products", element: <Products /> },
        // { path: "blog", element: <Blog /> },
      ],
    },
    {
      path: "/admin-dashboard/doctor",
      element: <DashboardLayout />,
      children: [
        {
          path: "manage-schedule-doctor",
          element: <ManageScheduleOneDoctor />,
        }, //quan ly ke hoach kham benh chi rieng mot bac si do
        { path: "manage-patient", element: <ManagePatient /> }, //quan ly benh nhan
      ],
    },
    // {
    //   path: "/",
    //   element: <LogoOnlyLayout />,
    //   children: [
    //     { path: "/", element: <Navigate to="/admin-dashboard/app" /> },
    //     { path: "admin-dashboard/login", element: <Login /> },
    //     { path: "admin-dashboard/register", element: <Register /> },
    //     { path: "admin-dashboard/404", element: <NotFound /> },
    //     { path: "*", element: <Navigate to="/404" /> },
    //   ],
    // },
    // { path: "*", element: <Navigate to="admin-dashboard/404" replace /> },
  ]);
}
