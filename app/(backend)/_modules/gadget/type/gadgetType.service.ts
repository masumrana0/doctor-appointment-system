import Auth from "@/app/(backend)/_core/error-handler/auth";
import { ApiErrors } from "@/app/(backend)/_core/errors/api-error";
import { translateContent } from "@/lib/ai/gemenai";
import prisma from "@/lib/prisma";

import { Language, Role } from "@prisma/client";

// create GadgetType
const createGadgetType = async (req: Request) => {
  await Auth([Role.ADMIN, Role.SUPER_ADMIN]);

  const { name } = await req.json();

  const isExistedGadgetType = await prisma.gadgetType.findUnique({
    where: {
      name: name,
      lang: "en",
    },
  });

  if (isExistedGadgetType) {
    throw ApiErrors.BadRequest(
      "This GadgetType name already exists. Please try another."
    );
  }

  const translated = await translateContent({ name });

  const result = await prisma.$transaction(async (tx) => {
    const englishGadgetType = await tx.gadgetType.create({
      data: {
        name,
        lang: "en",
      },
    });

    const banglaGadgetType = await tx.gadgetType.create({
      data: {
        name: translated!.name,
        lang: "bn",
        baseId: englishGadgetType.baseId,
      },
    });

    return { en: englishGadgetType, bn: banglaGadgetType };
  });

  return result;
};

// get All GadgetType
const getAllGadgetType = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const lang = (searchParams.get("lang") || "en") as Language;

  const result = await prisma.gadgetType.findMany({
    where: {
      lang: lang,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

//  Update GadgetType
const updateGadgetType = async (req: Request) => {
  await Auth([Role.ADMIN, Role.SUPER_ADMIN]);

  const { searchParams } = new URL(req.url);
  const GadgetTypeId = searchParams.get("id");
  if (!GadgetTypeId) throw ApiErrors.BadRequest("GadgetType ID is missing");

  // Get current GadgetType info to fetch baseId early
  const GadgetType = await prisma.gadgetType.findUnique({
    where: { id: GadgetTypeId },
  });
  if (!GadgetType) throw ApiErrors.NotFound("GadgetType not found");

  const { name } = await req.json();
  if (!name) throw ApiErrors.BadRequest("Edited text are required");

  const isExistedGadgetType = await prisma.gadgetType.findUnique({
    where: {
      name: name,
    },
  });
  if (isExistedGadgetType)
    throw ApiErrors.BadRequest(
      "This GadgetType name already existed.Please try to edit unique"
    );

  // Prepare translated content (can run in parallel with other async ops)
  const translated = await translateContent({ name: name });

  // Start transaction for consistency
  const result = await prisma.$transaction(async (tx) => {
    const updatedBase = await tx.gadgetType.update({
      where: { id: GadgetTypeId },
      data: { name },
    });

    const updatedBn = await tx.gadgetType.update({
      where: {
        baseId_lang_unique: {
          baseId: updatedBase.baseId,
          lang: "bn",
        },
      },
      data: { name: translated!.name },
    });

    return { en: updatedBase, bn: updatedBn };
  });

  return result;
};

// deleteGadgetType
const deleteGadgetType = async (req: Request) => {
  await Auth([Role.ADMIN, Role.SUPER_ADMIN]);

  const { searchParams } = new URL(req.url);
  const GadgetTypeBaseId = searchParams.get("baseId");

  if (!GadgetTypeBaseId)
    throw ApiErrors.BadRequest("GadgetType Base ID is missing");

  await prisma.gadgetType.deleteMany({
    where: {
      baseId: GadgetTypeBaseId,
    },
  });
};

export const GadgetTypeService = {
  createGadgetType,
  getAllGadgetType,
  updateGadgetType,
  deleteGadgetType,
};
