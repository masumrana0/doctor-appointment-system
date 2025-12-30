import {
  Bell,
  Calendar,
  LayoutDashboard,
  Settings,
  UserCog,
} from "lucide-react";

export const dashboardNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Staff Management",
    href: "/dashboard/staff",
    icon: UserCog,
  },
  {
    name: "Notices",
    href: "/dashboard/notices",
    icon: Bell,
  },
  { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },

  // { name: "Patients", href: "/dashboard/patients", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];
