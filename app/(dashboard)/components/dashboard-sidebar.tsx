"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Users,
  Settings,
  Shield,
  X,
  LayoutDashboard,
  UserCog,
  Bell,
  Calendar,
  ClipboardCheck,
} from "lucide-react";
import { User } from "@/interface";
import { dashboardNavigation } from "@/constants/dashboard-nav";

interface DashboardSidebarProps {
  user: User;
  isOpen?: boolean;
  onClose?: () => void;
  isDesktop?: boolean;
}

export function DashboardSidebar({
  user,
  isOpen = false,
  onClose,
  isDesktop = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out",
          isDesktop
            ? "translate-x-0"
            : isOpen
            ? "translate-x-0"
            : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center px-6 border-b">
          <div className="flex items-center gap-2 flex-1">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold"> Admin Panel</span>
          </div>
          {!isDesktop && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {dashboardNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.designation}</p>
            <div className="mt-2">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  user?.role === "super_admin"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary/10 text-secondary-foreground"
                )}
              >
                {user?.role.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
