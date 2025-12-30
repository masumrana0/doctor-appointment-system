import React from "react";
import Navbar from "./components/shared/navbar";
import Footer from "./components/shared/footer";
import PinnedNoticeNav from "./components/shared/pinned-notice-nav";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="pb-12">
      <Navbar />
      {children}
      <Footer />
      <PinnedNoticeNav />
    </main>
  );
};

export default HomeLayout;
