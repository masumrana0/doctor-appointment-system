"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2 } from "lucide-react";
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
import { useLoginMutation } from "@/redux/query/auth-query";
import type { LoginData } from "@/interface";

const DEFAULT_CREDENTIALS: LoginData = {
  email: "super-admin@gmail.com",
  password: "11223344",
};

export function LoginForm() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const [form, setForm] = useState<LoginData>(DEFAULT_CREDENTIALS);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(form).unwrap();
      if (data?.statusCode == 200) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.data?.message ?? "Login failed. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-7 w-7" />
          </div>
        </div>

        <div className="text-center">
          <CardTitle className="text-2xl">Staff Login</CardTitle>
          <CardDescription>
            Access your dashboard to manage appointments and patients
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Default credentials:</p>
            <p className="font-mono text-xs mt-1">
              super-admin@gmail.com / 11223344
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
