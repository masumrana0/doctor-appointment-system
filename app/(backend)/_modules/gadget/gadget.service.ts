import { Language, Role } from "@prisma/client";
import Auth from "../../_core/error-handler/auth";
import { ApiErrors } from "../../_core/errors/api-error";
import { uploader } from "@/lib/uploader/uploader";
import { translateContent } from "@/lib/ai/gemenai";
import prisma from "@/lib/prisma";
import { File } from "buffer";
import {
  gadgetFilterAbleFields,
  gadgetSearchableFields,
} from "../../_core/constants/gadget.constant";
import { paginationFields } from "../../_core/constants/patination.constant";
import pick from "../../_core/shared/pick";
import { paginationHelpers } from "../../_core/helper/pagination-helper";

// create Gadget
const createGadget = async (req: Request) => {
  // Auth check
  const session = await Auth([Role.ADMIN, Role.SUPER_ADMIN, Role.AUTHOR]);

  const formData = await req.formData();
  const file = formData.get("imgFile") as File | null;
  const fileList = formData.getAll("imgFiles") as unknown as File[];
  const payloadStr = formData.get("payload") as string | null;

  // Validate input
  if (!file || !fileList?.length || !payloadStr) {
    throw ApiErrors.BadRequest("imgFile, imgFiles, and payload are required.");
  }

  // Parse payload
  let payload: any;
  try {
    payload = JSON.parse(payloadStr);
  } catch {
    throw ApiErrors.BadRequest("Invalid JSON payload.");
  }

  // Upload images concurrently
  const [singleImageUpload, multipleImageUpload] = await Promise.all([
    uploader.uploadImages([file] as any),
    uploader.uploadImages(fileList as any),
  ]);

  const image = singleImageUpload[0]?.fileUrl;
  const images = multipleImageUpload.map((f: any) => f.fileUrl);

  if (!image || images.length === 0) {
    throw ApiErrors.BadRequest("Image upload failed.");
  }

  const { title, excerpt, content, ...rest } = payload;

  // Prepare English gadget
  const enGadget: any = {
    ...payload,
    image,
    images,
    authorId: session!.user.id,
    lang: "en" as const,
  };

  // Translate content to Bangla
  const translated = await translateContent({ title, excerpt, content });

  // Prepare Bangla gadget
  const bnGadget: any = {
    ...rest,
    ...translated,
    image,
    images,
    authorId: session!.user.id,
    lang: "bn" as const,
  };

  // Save both entries in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const en = await tx.gadget.create({ data: enGadget });
    const bn = await tx.gadget.create({
      data: {
        ...bnGadget,
        baseId: en.baseId,
      },
    });
    return { en, bn };
  });

  return result;
};

// update Gadget
export const updateGadget = async (req: Request) => {
  const session = await Auth([Role.ADMIN, Role.SUPER_ADMIN, Role.AUTHOR]);

  const { searchParams } = new URL(req.url);
  const gadgetId = searchParams.get("id");
  if (!gadgetId) throw ApiErrors.BadRequest("Gadget ID is missing");

  const existingGadget = await prisma.gadget.findFirst({
    where: { id: gadgetId },
  });

  if (!existingGadget) throw ApiErrors.NotFound("Gadget not found");

  if (
    session.user.role !== Role.SUPER_ADMIN &&
    existingGadget.authorId !== session.user.id
  ) {
    throw ApiErrors.Forbidden("You're not authorized to update this Gadget");
  }

  const formData = await req.formData();
  const file = formData.get("imgFile") as File | null;
  const fileList = formData.getAll("imgFiles") as unknown as File[];
  const payloadStr = formData.get("payload") as string | null;
  const removedImagesStr = formData.get("removedImages") as string | null;

  if (!payloadStr) {
    throw ApiErrors.BadRequest("Payload is required");
  }

  let payload: any;
  let removedImages: string[] = [];

  try {
    payload = JSON.parse(payloadStr);
    if (removedImagesStr) {
      removedImages = JSON.parse(removedImagesStr);
    }
  } catch {
    throw ApiErrors.BadRequest("Invalid JSON payload.");
  }

  // Prepare update objects
  const updatedBase: Record<string, any> = {};
  const updatedBangla: Record<string, any> = {};

  // Handle main image upload
  if (file) {
    try {
      const uploadedFiles = await uploader.uploadImages([file as any]);
      const newImage = uploadedFiles[0]?.fileUrl;
      if (newImage) {
        updatedBase.image = newImage;
        updatedBangla.image = newImage;

        // Delete old image if it exists
        if (existingGadget.image) {
          await uploader.deleteImage(existingGadget.image);
        }
      }
    } catch (error) {
      // console.error("Error uploading main image:", error);
      throw ApiErrors.BadRequest("Failed to upload main image");
    }
  }

  // Handle multiple images upload
  if (fileList && fileList.length > 0) {
    try {
      const uploadedFiles = await uploader.uploadImages(fileList as any);
      const newImages = uploadedFiles.map((f: any) => f.fileUrl);

      // Get existing images and filter out removed ones
      const existingImages = (existingGadget.images as string[]) || [];
      const filteredExistingImages = existingImages.filter(
        (img) => !removedImages.includes(img)
      );

      // Combine existing (not removed) with new images
      const combinedImages = [...filteredExistingImages, ...newImages];

      updatedBase.images = combinedImages;
      updatedBangla.images = combinedImages;
    } catch (error) {
      // console.error("Error uploading multiple images:", error);
      throw ApiErrors.BadRequest("Failed to upload images");
    }
  } else if (removedImages.length > 0) {
    // Only removing images, no new uploads
    const existingImages = (existingGadget.images as string[]) || [];
    const filteredImages = existingImages.filter(
      (img) => !removedImages.includes(img)
    );
    updatedBase.images = filteredImages;
    updatedBangla.images = filteredImages;
  }

  // Delete removed images from storage
  if (removedImages.length > 0) {
    try {
      await Promise.all(
        removedImages.map((imageUrl) => uploader.deleteImage(imageUrl))
      );
    } catch (error) {
      // console.error("Error deleting removed images:", error);
      // Don't throw here, continue with update
    }
  }

  // Add other payload fields to update objects
  Object.keys(payload).forEach((key) => {
    if (key !== "image" && key !== "images" && payload[key] !== undefined) {
      updatedBase[key] = payload[key];
    }
  });

  // Handle translation for translatable fields
  const translatableFields = ["title", "excerpt", "content"];
  const fieldsToTranslate: any = {};
  let needsTranslation = false;

  translatableFields.forEach((field) => {
    if (
      payload[field] &&
      payload[field] !== existingGadget[field as keyof typeof existingGadget]
    ) {
      fieldsToTranslate[field] = payload[field];
      needsTranslation = true;
    }
  });

  if (needsTranslation) {
    try {
      const translatedContent = await translateContent(fieldsToTranslate);
      Object.assign(updatedBangla, translatedContent);
    } catch (error) {
      // console.error("Translation error:", error);
      // Continue without translation if it fails
    }
  }

  // Add non-translatable fields to Bangla version
  Object.keys(payload).forEach((key) => {
    if (
      !translatableFields.includes(key) &&
      key !== "image" &&
      key !== "images" &&
      payload[key] !== undefined
    ) {
      updatedBangla[key] = payload[key];
    }
  });

  // Perform the database update
  const result = await prisma.$transaction(async (tx) => {
    const updates = [];

    // Update English version if there are changes
    if (Object.keys(updatedBase).length > 0) {
      const englishUpdate = tx.gadget.update({
        where: {
          baseId_lang_unique: {
            baseId: existingGadget.baseId,
            lang: "en",
          },
        },
        data: updatedBase,
      });
      updates.push(englishUpdate);
    }

    // Update Bangla version if there are changes
    if (Object.keys(updatedBangla).length > 0) {
      const banglaUpdate = tx.gadget.update({
        where: {
          baseId_lang_unique: {
            baseId: existingGadget.baseId,
            lang: "bn",
          },
        },
        data: updatedBangla,
      });
      updates.push(banglaUpdate);
    }

    // Execute all updates
    if (updates.length > 0) {
      const results = await Promise.all(updates);
      return {
        en: results[0] || null,
        bn: results[1] || results[0] || null,
      };
    }

    // If no updates, return existing data
    return {
      en: existingGadget,
      bn: null,
    };
  });

  return result;
};

// delete Gadget
const deleteGadget = async (req: Request) => {
  const session = await Auth([Role.ADMIN, Role.SUPER_ADMIN, Role.AUTHOR]);
  const { searchParams } = new URL(req.url);
  const GadgetId = searchParams.get("id");

  if (!GadgetId) throw ApiErrors.BadRequest("Gadget ID is missing");

  // Check if Gadget exists
  const isExistGadget = await prisma.gadget.findFirst({
    where: { id: GadgetId },
  });

  if (!isExistGadget) throw ApiErrors.NotFound("Gadget not found");

  // Only allow SUPER_ADMIN or the author to delete the Gadget
  if (
    session.user.role !== Role.SUPER_ADMIN &&
    isExistGadget.authorId !== session.user.id
  ) {
    throw ApiErrors.BadRequest("You're not authorized to  delete this Gadget");
  }

  await prisma.gadget.deleteMany({
    where: { baseId: isExistGadget.baseId },
  });

  await uploader.deleteImage(isExistGadget.image);
  isExistGadget.images.forEach(async (img) => {
    await uploader.deleteImage(img);
  });
};

// getAllGadget for admin
const getAllGadget = async (req: Request) => {
  // Auth guard (optional)
  await Auth([Role.ADMIN, Role.SUPER_ADMIN]);

  const { searchParams } = new URL(req.url);

  const searchParamsObj = Object.fromEntries(searchParams.entries());

  const filters = pick(searchParamsObj, gadgetFilterAbleFields);

  const paginationOptions = pick(searchParamsObj, paginationFields);

  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const searchTerm = searchParamsObj.searchTerm || "";
  const lang = (searchParamsObj.lang || "en") as Language;

  const where: any = {
    lang: lang,
  };

  // Search logic
  if (searchTerm) {
    where.OR = gadgetSearchableFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }));
  }

  // Apply filters
  for (const [key, value] of Object.entries(filters)) {
    if (value && key !== "searchTerm") {
      if (value === "true" || value === "false") {
        where[key] = value === "true";
      } else {
        where[key] = value;
      }
    }
  }

  const orderBy: any = {};
  if (sortBy && sortOrder) {
    orderBy[sortBy] = sortOrder.toLowerCase();
  } else {
    orderBy.createdAt = "desc";
  }

  // Fetch Gadgets with populated Category
  const Gadgets = await prisma.gadget.findMany({
    where,
    skip,
    take: limit,
    orderBy,
    include: {
      brand: true,
      type: true,
    },
  });

  const result = Gadgets.map(async (Gadget) => {
    const { brand, type, ...rest } = Gadget;
    const Brand = await prisma.gadgetBrand.findFirst({
      where: { baseId: brand!.baseId, lang: lang },
    });
    const Type = await prisma.gadgetBrand.findFirst({
      where: { baseId: type!.baseId, lang: lang },
    });

    return {
      ...rest,
      brand: Brand,
      type: Type,
    };
  });

  const formattedResultPromise = await Promise.all(result);

  // Count for pagination
  const total = await prisma.gadget.count({ where });
  const totalPage = Math.ceil(total / limit);

  return {
    result: formattedResultPromise,
    meta: {
      total,
      page,
      limit,
      totalPage,
    },
  };
};

const getOneGadget = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const baseId = searchParams.get("baseId");
  const lang = (searchParams.get("lang") || "en") as Language;

  if (!baseId) {
    throw ApiErrors.BadRequest("Article baseID is missing");
  }

  const gadget = await prisma.gadget.findUnique({
    where: {
      baseId_lang_unique: { baseId, lang },
    },
    include: {
      brand: true,
      type: true,
      author: true,
    },
  });

  if (!gadget) {
    throw ApiErrors.NotFound("Article not found");
  }

  // Fetch localized brand and type concurrently
  const [localizedBrand, localizedType] = await Promise.all([
    prisma.gadgetBrand.findFirst({
      where: { baseId: gadget.brandBaseId, lang },
    }),
    prisma.gadgetType.findFirst({
      where: { baseId: gadget.typeBaseId, lang },
    }),
  ]);

  return {
    ...gadget,
    brand: localizedBrand ?? gadget.brand,
    type: localizedType ?? gadget.type,
  };
};

export const GadgetService = {
  createGadget,
  getAllGadget,
  updateGadget,
  deleteGadget,
  getOneGadget,
};
