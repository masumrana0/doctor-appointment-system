import React from "react";
import Navbar from "./components/shared/navbar";
import Footer from "./components/shared/footer";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
};

export default HomeLayout;
