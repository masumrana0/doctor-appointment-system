"use client";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePasswordChangeMutation } from "@/redux/query/auth-query";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const PasswordChangeForm = () => {
  const [changePassword, { isLoading }] = usePasswordChangeMutation();

  // Password form state
  const [passwordData, setPasswordData] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const isUpdatedAble =
    passwordData.currentPassword &&
    passwordData.newPassword &&
    passwordData.confirmPassword &&
    !isLoading;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match", {
        description: "Please make sure both new password fields are identical.",
      });

      return;
    }

    if (passwordData.newPassword && passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        description: "Please enter a password with at least 6 characters.",
      });

      return;
    }

    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword!,
        newPassword: passwordData.newPassword!,
      }).unwrap();

      if (response?.success == true) {
        toast.success("Password changed successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "An error occurred. Please try again."
      );
    }
  };
  return (
    <form onSubmit={handlePasswordChange} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          value={passwordData.currentPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              currentPassword: e.target.value,
            })
          }
          required
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              newPassword: e.target.value,
            })
          }
          required
        />
        <p className="text-xs text-muted-foreground">
          Must be at least 6 characters long
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={passwordData.confirmPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              confirmPassword: e.target.value,
            })
          }
          required
        />
      </div>

      <Button type="submit" disabled={!isUpdatedAble}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Changing...
          </>
        ) : (
          "Change Password"
        )}
      </Button>
    </form>
  );
};

export default PasswordChangeForm;
