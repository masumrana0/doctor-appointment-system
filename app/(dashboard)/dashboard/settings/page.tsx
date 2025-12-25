"use client";

import { ProfileSettings } from "../../components/profile-settings";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <ProfileSettings />
    </div>
  );
};

export default SettingsPage;
