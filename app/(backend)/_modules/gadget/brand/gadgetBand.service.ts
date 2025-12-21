import Auth from "@/app/(backend)/_core/error-handler/auth";
import { ApiErrors } from "@/app/(backend)/_core/errors/api-error";
import { translateContent } from "@/lib/ai/gemenai";
import prisma from "@/lib/prisma";

import { Language, Role } from "@prisma/client";

// create GadgetBrand
const createGadgetBrand = async (req: Request) => {
  await Auth([Role.ADMIN, Role.SUPER_ADMIN]);

  const { name } = await req.json();

  const isExistedGadgetBrand = await prisma.gadgetBrand.findFirst({
    where: {
      name: name,
      lang: "en",
    },
  });

  if (isExistedGadgetBrand) {
    throw ApiErrors.BadRequest(
      "This GadgetBrand name already exists. Please try another."
    );
  }

  const translated = await translateContent({ name });

  const result = await prisma.$transaction(async (tx) => {
    const englishGadgetBrand = await tx.gadgetBrand.create({
      data: {
        name,
        lang: "en",
      },
    });

    const banglaGadgetBrand = await tx.gadgetBrand.create({
      data: {
        name: translated!.name,
        lang: "bn",
        baseId: englishGadgetBrand.baseId,
      },
    });

    return { en: englishGadgetBrand, bn: banglaGadgetBrand };
  });

  return result;
};

// get All GadgetBrand
const getAllGadgetBrand = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const lang = (searchParams.get("lang") || "en") as Language;

  const result = await prisma.gadgetBrand.findMany({
    where: {
      lang: lang,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

//  Update GadgetBrand
const updateGadgetBrand = async (req: Request) => {
  await Auth([Role.ADMIN, Role.SUPER_ADMIN]);

  const { searchParams } = new URL(req.url);
  const GadgetBrandId = searchParams.get("id");
  if (!GadgetBrandId) throw ApiErrors.BadRequest("GadgetBrand ID is missing");

  // Get current GadgetBrand info to fetch baseId early
  const GadgetBrand = await prisma.gadgetBrand.findUnique({
    where: { id: GadgetBrandId },
  });
  if (!GadgetBrand) throw ApiErrors.NotFound("GadgetBrand not found");

  const { name } = await req.json();
  if (!name) throw ApiErrors.BadRequest("Edited text are required");

  const isExistedGadgetBrand = await prisma.gadgetBrand.findUnique({
    where: {
      name: name,
    },
  });
  if (isExistedGadgetBrand)
    throw ApiErrors.BadRequest(
      "This GadgetBrand name already existed.Please try to edit unique"
    );

  // Prepare translated content (can run in parallel with other async ops)
  const translated = await translateContent({ name: name });

  // Start transaction for consistency
  const result = await prisma.$transaction(async (tx) => {
    const updatedBase = await tx.gadgetBrand.update({
      where: { id: GadgetBrandId },
      data: { name },
    });

    const updatedBn = await tx.gadgetBrand.update({
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

// delete GadgetBrand
const deleteGadgetBrand = async (req: Request) => {
  await Auth([Role.ADMIN, Role.SUPER_ADMIN]);

  const { searchParams } = new URL(req.url);
  const GadgetBrandBaseId = searchParams.get("baseId");

  if (!GadgetBrandBaseId)
    throw ApiErrors.BadRequest("GadgetBrand Base ID is missing");

  await prisma.gadgetBrand.deleteMany({
    where: {
      baseId: GadgetBrandBaseId,
    },
  });
};

export const GadgetBrandService = {
  createGadgetBrand,
  getAllGadgetBrand,
  updateGadgetBrand,
  deleteGadgetBrand,
};
