"use client"; 

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Send } from "lucide-react";

interface NoticeManagementProps {
  onNoticeCreated?: () => void;
}

export function NoticeManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // try {
    //   const token = localStorage.getItem("token");
    //   const response = await fetch("/api/notices", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify({ ...formData, isActive: true }),
    //   });

    //   if (response.ok) {
    //     setFormData({ title: "", content: "" });
    //     // onNoticeCreated?.();
    //   }
    // } catch (error) {
    //   console.error("[v0] Failed to create notice:", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Create Notice</CardTitle>
            <CardDescription>
              Post announcements for patients on the homepage
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notice-title">Title</Label>
            <Input
              id="notice-title"
              placeholder="Important Announcement"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notice-content">Content</Label>
            <Textarea
              id="notice-content"
              placeholder="Enter your announcement details here..."
              rows={4}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            <Send className="mr-2 h-4 w-4" />
            Publish Notice
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
