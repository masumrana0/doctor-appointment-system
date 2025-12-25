"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/interface";
import { useUpdateLoggedInUserMutation } from "@/redux/query/user-query";
import { Check, Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const UpdateProfileForm = ({ user }: { user: User }) => {
  const [update, { isLoading }] = useUpdateLoggedInUserMutation();

  // Initialize form data with current user data
  const [formData, setFormData] = React.useState<Partial<User>>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    designation: user?.designation || "",
  });

  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  // Check if form has been modified
  const hasChanges = React.useMemo(() => {
    return (
      formData.name !== user?.name ||
      formData.email !== user?.email ||
      formData.phone !== user?.phone ||
      formData.designation !== user?.designation
    );
  }, [formData, user]);

  // Only allow submission if there are changes and not loading
  const canSubmit = hasChanges && !isLoading;
  const handleInputChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear messages when user starts typing
    if (successMessage) setSuccessMessage("");
    if (errorMessage) setErrorMessage("");
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    try {
      // Only send changed fields to backend
      const changedFields: Partial<User> = {};

      if (formData.name !== user?.name) changedFields.name = formData.name;
      if (formData.email !== user?.email) changedFields.email = formData.email;
      if (formData.phone !== user?.phone) changedFields.phone = formData.phone;
      if (formData.designation !== user?.designation)
        changedFields.designation = formData.designation;

      const response = await update(changedFields).unwrap();

      if (response?.success) {
        setSuccessMessage("Profile updated successfully.");
        setErrorMessage("");
        toast.success("Profile updated successfully", {
          description: "Your profile has been updated.",
        });
      }
    } catch (error: any) {
      const errorMsg = error?.data?.message || "Failed to update profile";
      setErrorMessage(errorMsg);
      setSuccessMessage("");
      toast.error(errorMsg, {
        description: "Failed to update profile. Please try again.",
      });
    }
  };
  return (
    <form onSubmit={handleProfileUpdate} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+880 1XXXXXXXXX"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            value={formData.designation}
            onChange={(e) => handleInputChange("designation", e.target.value)}
            placeholder="e.g., Chief Medical Officer"
          />
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-600 dark:text-green-400">
          <Check className="h-4 w-4" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <Button type="submit" disabled={!canSubmit}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
};

export default UpdateProfileForm;
