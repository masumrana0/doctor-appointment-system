"use client";

import { useEffect, useState } from "react";
import AppointmentSection from "../components/appointment-section";

const AppointmentPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <AppointmentSection />;
};

export default AppointmentPage;
