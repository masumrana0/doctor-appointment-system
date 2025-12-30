import { getPinnedNavNotices } from "@/lib/actions";
import PinnedNoticeNavClient from "./pinned-notice-nav.client";

export default async function PinnedNoticeNav() {
  const notices = await getPinnedNavNotices();
  const tickerText = notices.map((notice) => notice.content).join("    |   ");
  if (!tickerText) return null;

  return <PinnedNoticeNavClient tickerText={tickerText} />;
}
