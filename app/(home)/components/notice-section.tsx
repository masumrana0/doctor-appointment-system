import React from "react";
import { NoticeBoard } from "./noticeBoard";

const NoticeSection = () => {
  return (
    <section className="w-full py-12 md:py-20 animate-in fade-in duration-1000">
      <div className="container mx-auto px-4">
        <NoticeBoard />
      </div>
    </section>
  );
};

export default NoticeSection;
