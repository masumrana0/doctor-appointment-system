import { ISendApiResponse } from "@/app/(backend)/_core/interface/response";
import { Notice } from "@/app/generated/prisma/client";
import { AUTH_TOKEN } from "@/constants/keys";
import type { DashboardOverview } from "@/interface";
import { cookies, headers } from "next/headers";

type ApiFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
};

const getRequestOrigin = async (): Promise<string> => {
  const headerStore = await headers();

  const forwardedProto = headerStore.get("x-forwarded-proto");
  const proto = forwardedProto ?? "http";

  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = forwardedHost ?? headerStore.get("host");

  if (host) return `${proto}://${host}`;

  const envUrl = process.env.NEXT_PUBLIC_BASE_URL;
  return envUrl || "http://localhost:3000";
};

const apiFetch = async <T>(
  path: string,
  options?: ApiFetchOptions
): Promise<T> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN)?.value;

  const origin = await getRequestOrigin();
  const url = new URL(path, origin);

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options?.headers ?? {}),
      ...(token ? { cookie: `${AUTH_TOKEN}=${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${path} (${res.status})`);
  }

  return (await res.json()) as T;
};

export const getAdminDashboardStats = async (): Promise<DashboardOverview> => {
  const json = await apiFetch<ISendApiResponse<DashboardOverview>>(
    "/api/super-admin/dashboard",
    { method: "GET", cache: "no-store" }
  );

  if (!json.data) {
    const year = String(new Date().getFullYear());
    return {
      totalStaff: 0,
      totalAppointments: 0,
      todayAppointments: 0,
      activeNotices: 0,
      yearly: {
        years: [year],
        defaultYear: year,
        dataByYear: { [year]: [] },
      },
      weekly: { rangeLabel: "", data: [] },
    };
  }

  return json.data;
};

export const getActiveNotices = async (): Promise<Notice[] | []> => {
  const json = await apiFetch<ISendApiResponse<Notice[]>>(
    "/api/notice?active=true",
    { method: "GET", cache: "no-store" }
  );

  return json.data ?? [];
};

export const getPinnedNavNotices = async (): Promise<Notice[]> => {
  const json = await apiFetch<ISendApiResponse<Notice[]>>(
    "/api/notice?pinNav=true",
    { method: "GET", cache: "no-store" }
  );

  return json.data ?? [];
};
