"use client";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/interface";
import { useCreateUserMutation } from "@/redux/query/user-query";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const CreateUserForm: React.FC<{
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isDialogOpen, setIsDialogOpen }) => {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    password: "",
    role: "admin",
    phone: "",
    designation: "",
  });

  const getErrorMessage = (error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "data" in error &&
      typeof (error as any).data === "object" &&
      (error as any).data !== null &&
      "message" in (error as any).data
    ) {
      return (error as { data: { message?: string } }).data.message;
    }
    if (error instanceof Error) return error.message;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createUser(formData).unwrap();
      if (res.success) {
        toast.success("User created successfully", {
          description: "New staff account has been created.",
        });
      }
    } catch (error) {
      toast.error("Failed to create user", {
        description:
          getErrorMessage(error) ||
          "There was an error creating the staff account.",
      });
    }
    setIsDialogOpen(false);
  };
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Staff Management</CardTitle>
        <CardDescription>Create and manage staff accounts</CardDescription>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Staff Account</DialogTitle>
            <DialogDescription>
              Add a new admin or receptionist to manage appointments
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                placeholder="e.g., Receptionist"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              Create Staff Account
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateUserForm;
