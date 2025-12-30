"use client";
import React from "react";

const Loader = ({height = "50vh"}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className={`flex h-[${height}] w-full items-center justify-center`}>
      <div
        className={`mb-8 transition-all duration-1000 ${
          mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <div className="relative">
          {/* Pulsing ring */}
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: "oklch(0.6 0.118 184.704)" }}
          />
          {/* Medical cross container */}
          <div
            className="relative flex h-32 w-32 items-center justify-center rounded-full backdrop-blur-xl border border-white/20"
            style={{ backgroundColor: "oklch(0.6 0.118 184.704 / 0.15)" }}
          >
            {/* Cross shape */}
            <div className="relative h-16 w-16">
              <div
                className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 rounded-sm"
                style={{ backgroundColor: "oklch(0.6 0.118 184.704)" }}
              />
              <div
                className="absolute top-1/2 left-0 h-4 w-full -translate-y-1/2 rounded-sm"
                style={{ backgroundColor: "oklch(0.6 0.118 184.704)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
