import { requireAuth } from "@/app/(backend)/_core/error-handler/auth";
import { ApiErrors } from "@/app/(backend)/_core/errors/api-error";
import { prisma } from "@/lib/prisma";

export type NoticeCreatePayload = {
  title: string;
  content: string;
  isActive?: boolean;
  isPinned?: boolean;
  isPinNav?: boolean;
};

export type NoticeUpdatePayload = Partial<NoticeCreatePayload>;

const getAllNotice = async (req: Request) => {
  const url = new URL(req.url);
  const activeOnly = url.searchParams.get("active") === "true";

  const pinNavOnly =
    url.searchParams.get("pinNav") === "true" ||
    url.searchParams.get("isPinNav") === "true";

  // Public access is allowed only for active notices or pinNav notices
  if (!activeOnly && !pinNavOnly) {
    await requireAuth();
  }

  const notices = await prisma.notice.findMany({
    where: pinNavOnly
      ? { isActive: true, isPinNav: true }
      : activeOnly
      ? { isActive: true }
      : undefined,
    orderBy: pinNavOnly
      ? [{ createdAt: "desc" }]
      : [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return notices;
};

const createNotice = async (req: Request) => {
  const user = await requireAuth();
  if (user.role !== "super_admin") {
    throw ApiErrors.Forbidden("Only super admin can create notices");
  }

  const body = (await req.json()) as NoticeCreatePayload;

  if (!body?.title || !body?.content) {
    throw ApiErrors.BadRequest("Title and content are required");
  }

  const notice = await prisma.notice.create({
    data: {
      title: body.title,
      content: body.content,
      isActive: body.isActive ?? true,
      isPinned: body.isPinned ?? false,
      isPinNav: body.isPinNav ?? false,
    },
  });

  return notice;
};

const updateNotice = async (req: Request, id: string) => {
  const user = await requireAuth();
  if (user.role !== "super_admin") {
    throw ApiErrors.Forbidden("Only super admin can update notices");
  }

  const body = (await req.json()) as NoticeUpdatePayload;

  if (!id) {
    throw ApiErrors.BadRequest("Notice id is required");
  }

  const notice = await prisma.notice.update({
    where: { id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.content !== undefined ? { content: body.content } : {}),
      ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      ...(body.isPinned !== undefined ? { isPinned: body.isPinned } : {}),
      ...(body.isPinNav !== undefined ? { isPinNav: body.isPinNav } : {}),
    },
  });

  return notice;
};

const deleteNotice = async (id: string) => {
  const user = await requireAuth();
  if (user.role !== "super_admin") {
    throw ApiErrors.Forbidden("Only super admin can delete notices");
  }

  if (!id) {
    throw ApiErrors.BadRequest("Notice id is required");
  }

  await prisma.notice.delete({ where: { id } });
  return null;
};

export const NoticeService = {
  getAllNotice,
  createNotice,
  updateNotice,
  deleteNotice,
};
