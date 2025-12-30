"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCog } from "lucide-react";
import { User } from "@/interface";
import { useGetAllUserQuery } from "@/redux/query/user-query";
import Loader from "@/components/shared/loader";
import CreateUserForm from "./create-user-form";
import StaffCard from "./staf-card";

export function StaffManagement() {
  const { data, isLoading } = useGetAllUserQuery(null);

  const staff = ((data?.data ?? []) as User[]).filter(
    (u): u is User & { id: string } => typeof u?.id === "string" && u.id.length > 0
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CreateUserForm
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="space-y-4">
            {staff.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserCog className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No staff members yet</p>
              </div>
            ) : (
              staff.map((member) => (
                <StaffCard key={member.id} member={member} />
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
