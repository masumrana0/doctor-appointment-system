import type { Metadata } from "next";
import NoticesClientPage from "./notices.client";

export const metadata: Metadata = {
  title: "Notices",
};

export default function NoticesManagementPage() {
  return <NoticesClientPage />;
}
