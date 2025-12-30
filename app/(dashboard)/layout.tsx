import React from "react";
import { DashboardClientLayout } from "./components/dashboard-layout";
import { Auth } from "../(backend)/_core/error-handler/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
// import { useRouter } from "next/router";

export const dynamic = "force-dynamic";
const layout = async ({ children }: { children: React.ReactNode }) => {
  const auth = Auth.getInstance();
  const user = await auth.requireAuth();
  const cookieStore = cookies();

  const handleLogout = async () => {
    // await cookieStore.delete("auth_token");
    redirect("/login");
    // try {
    //   await fetch("/api/auth/logout", { method: "POST" });
    //   redirect("/login");
    // } catch (error) {
    //   redirect("/login");

    //   // console.error("Logout error:", error);
    // }
  };

  if (!user) {
    return await handleLogout();
  }
  return (
    <>
      <DashboardClientLayout user={user}>{children}</DashboardClientLayout>
    </>
  );
};

export default layout;
