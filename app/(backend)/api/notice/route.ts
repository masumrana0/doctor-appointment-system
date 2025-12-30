import { NoticeController } from "@/app/(backend)/_modules/notice/controller/notice.controller";

export const GET = NoticeController.getAllNotice;
export const POST = NoticeController.createNotice;
