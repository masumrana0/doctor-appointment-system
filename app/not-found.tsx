export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import NotFoundPage from "@/components/shared/not-found";

export const metadata: Metadata = {
  title: "Not Found",
};

const NotFound = () => {
  return <NotFoundPage />;
};

export default NotFound;
