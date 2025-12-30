import { getActiveNotices } from "@/lib/actions";
import { NoticeBoardClient } from "./noticeBoard.client";

export default async function NoticeSection() {
  const notices = await getActiveNotices();
  return (
    <section className="w-full py-12 md:py-20 animate-in fade-in duration-1000">
      <div className="container mx-auto px-4">
        <NoticeBoardClient notices={notices} />
      </div>
    </section>
  );
}
