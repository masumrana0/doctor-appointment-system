import type { Metadata } from "next";
import SettingsClientPage from "./settings.client";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return <SettingsClientPage />;
}
