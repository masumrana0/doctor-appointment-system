import React from "react";
import { DashboardClientLayout } from "./components/dashboard-layout";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DashboardClientLayout
        user={{
          id: "213974",
          email: "user@example.com",
          password: "password",
          name: "John Doe",
          role: "super_admin",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        }}
      >
        {children}
      </DashboardClientLayout>
    </>
  );
};

export default layout;
