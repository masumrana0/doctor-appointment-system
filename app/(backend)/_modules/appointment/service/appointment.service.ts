import Auth from "@/app/(backend)/_core/error-handler/auth";

// create Appointment
const createAppointment  = async (req: Request) => {
  const session = await Auth([Role.ADMIN, Role.SUPER_ADMIN, Role.AUTHOR]);
  const formData = await req.formData();

  const file = formData.get("imgFile") as File | null;
  const payloadStr = formData.get("payload") as string | null;

  if (!file || !payloadStr) {
    throw ApiErrors.BadRequest("File and payload are required.");
  }

  const image = savedFile[0].fileUrl;
  const { title, excerpt, content, ...rest } = payload;

  // Base (English) Appoinment
  const baseAppoinment = {
    ...payload,
    image,
    authorId: session!.user.id,
    lang: "en",
  };

  // Translate content to Bangla
  const translated = await translateContent({ title, excerpt, content });
  console.log(translated);

  // Bangla Appoinment
  const banglaAppoinment = {
    ...rest,
    ...translated,
    image,
    authorId: session!.user.id,
    lang: "bn",
  };
  console.log(banglaAppoinment);

  // Save both Appoinments in a transaction
  const result = await prisma.$transaction(
    async (tx) => {
      const baseData = await tx.Appoinment.create({ data: baseAppoinment });
      const banglaData = await tx.Appoinment.create({
        data: {
          ...banglaAppoinment,
          baseId: baseData.baseId,
        },
      });

      return { en: baseData, bn: banglaData };
    },
    {
      timeout: 10000, // 10 seconds
    }
  );

  return result;
};

// update Appoinment
const updateAppoinment = async (req: Request) => {
  const session = await Auth([Role.ADMIN, Role.SUPER_ADMIN, Role.AUTHOR]);

  const { searchParams } = new URL(req.url);
  const AppoinmentId = searchParams.get("id");
  if (!AppoinmentId) throw ApiErrors.BadRequest("Appoinment ID is missing");

  // Check if Appoinment exists
  const isExistAppoinment = await prisma.Appoinment.findFirst({
    where: { id: AppoinmentId },
  });

  if (!isExistAppoinment) throw ApiErrors.NotFound("Appoinment not found");

  // Only allow SUPER_ADMIN or the author to update the Appoinment
  if (
    session.user.role !== Role.SUPER_ADMIN &&
    isExistAppoinment.authorId !== session.user.id
  ) {
    throw ApiErrors.BadRequest("You're not authorized to update this Appoinment");
  }

  // Get form data
  const formData = await req.formData();

  const file = formData.get("imgFile") as File | null;
  const payloadStr = formData.get("payload") as string | null;
  const updatedBase: Record<string, any> = {};
  const updatedBangla: Record<string, any> = {};

  if (!file && !payloadStr) {
    throw ApiErrors.BadRequest("Required data is missing");
  }

  if (file) {
    const savedFile = await uploader.uploadImages([file]),
      image = savedFile[0].fileUrl as string;
    updatedBangla.image = savedFile[0].fileUrl as string;
    updatedBase.image = savedFile[0].fileUrl as string;
  }

  if (payloadStr) {
    const basePayload = JSON.parse(payloadStr);
    Object.assign(updatedBase, basePayload);
  }

  const { title, excerpt, content, ...others } = updatedBase;
  let translatedContent: any = {};
  if (!title || !excerpt || !content) {
    translatedContent = await translateContent({
      title: title,
      excerpt: excerpt,
      content: content,
    });
  }

  Object.assign(updatedBangla, others);

  if (Object.keys(translatedContent).length > 0) {
    const allData = { ...translatedContent };
    Object.assign(updatedBangla, allData);
  }

  const result = await prisma.$transaction(async (tx) => {
    // Update base (English) Appoinment
    const updatedBaseAppoinment = await tx.Appoinment.update({
      where: {
        baseId_lang_unique: {
          baseId: isExistAppoinment.baseId,
          lang: "en",
        },
      },
      data: {
        ...updatedBase,
      },
    });

    // Update Bangla version
    const updatedBanglaAppoinment = await tx.Appoinment.update({
      where: {
        baseId_lang_unique: {
          baseId: isExistAppoinment.baseId,
          lang: "bn",
        },
      },
      data: {
        ...updatedBangla,
      },
    });

    return { base: updatedBaseAppoinment, bn: updatedBanglaAppoinment };
  });

  if (file) {
    await uploader.deleteImage(isExistAppoinment.image as string);
  }

  return result;
};

// delete Appoinment
const deleteAppoinment = async (req: Request) => {
  const session = await Auth([Role.ADMIN, Role.SUPER_ADMIN, Role.AUTHOR]);
  const { searchParams } = new URL(req.url);
  const AppoinmentId = searchParams.get("id");

  if (!AppoinmentId) throw ApiErrors.BadRequest("Appoinment ID is missing");

  // Check if Appoinment exists
  const isExistAppoinment = await prisma.Appoinment.findFirst({
    where: { id: AppoinmentId },
  });

  if (!isExistAppoinment) throw ApiErrors.NotFound("Appoinment not found");

  // Only allow SUPER_ADMIN or the author to delete the Appoinment
  if (
    session.user.role !== Role.SUPER_ADMIN &&
    isExistAppoinment.authorId !== session.user.id
  ) {
    throw ApiErrors.BadRequest("You're not authorized to  delete this Appoinment");
  }

  await prisma.Appoinment.deleteMany({
    where: { baseId: isExistAppoinment.baseId },
  });

  await uploader.deleteImage(isExistAppoinment.image);
};

// getAllAppoinment for admin
const getAllAppoinment = async (req: Request) => {
  // Auth guard (optional)
  await Auth([Role.ADMIN, Role.SUPER_ADMIN]);

  const { searchParams } = new URL(req.url);

  const searchParamsObj = Object.fromEntries(searchParams.entries());

  const filters = pick(searchParamsObj, AppoinmentFilterAbleFields);

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
    where.OR = AppoinmentSearchableFields.map((field) => ({
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

  // Fetch Appoinments with populated Category
  const Appoinments = await prisma.Appoinment.findMany({
    where,
    skip,
    take: limit,
    orderBy,
    include: {
      category: true,
    },
  });

  const result = Appoinments.map(async (Appoinment) => {
    const { category, ...rest } = Appoinment;
    const Category = await prisma.category.findFirst({
      where: { baseId: category!.baseId, lang: lang },
    });

    return {
      ...rest,
      category: Category,
    };
  });
  const formattedResultPromise = await Promise.all(result);

  // Count for pagination
  const total = await prisma.Appoinment.count({ where });
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

// get all Appoinment  for all
const getAllFeaturedAppoinment = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const searchParamsObj = Object.fromEntries(searchParams.entries());

  const filters = pick(searchParamsObj, AppoinmentFilterAbleFields);

  const paginationOptions = pick(searchParamsObj, paginationFields);

  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const searchTerm = searchParamsObj.searchTerm || "";
  const sort = searchParamsObj.sort || "newest";
  const lang = (searchParamsObj.lang || "en") as Language;

  const where: any = {
    lang: lang,
    isFeatured: true,
  };

  // Search logic
  if (searchTerm) {
    where.OR = AppoinmentSearchableFields.map((field) => ({
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
  if (sort == "newest") {
    orderBy.createdAt = "desc";
  } else if (sort == "oldest") {
    orderBy.createdAt = "asc";
  }

  // Fetch Appoinments with populated Category
  const Appoinments = await prisma.Appoinment.findMany({
    where,
    skip,
    take: limit,
    orderBy,
    include: {
      category: true,
    },
  });

  const result = Appoinments.map(async (Appoinment) => {
    const { category, ...rest } = Appoinment;
    const Category = await prisma.category.findFirst({
      where: { baseId: category!.baseId, lang: lang },
    });

    return {
      ...rest,
      category: Category,
    };
  });
  const formattedResultPromise = await Promise.all(result);

  // Count for pagination
  const total = await prisma.Appoinment.count({ where });
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

// get all Appoinment  for all
const getAllLatestAppoinment = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const searchParamsObj = Object.fromEntries(searchParams.entries());

  const filters = pick(searchParamsObj, AppoinmentFilterAbleFields);

  const paginationOptions = pick(searchParamsObj, paginationFields);

  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const searchTerm = searchParamsObj.searchTerm || "";
  const sort = searchParamsObj.sort || "newest";
  const lang = (searchParamsObj.lang || "en") as Language;

  const where: any = {
    lang: lang,
    isLatest: true,
  };

  // Search logic
  if (searchTerm) {
    where.OR = AppoinmentSearchableFields.map((field) => ({
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
  if (sort == "newest") {
    orderBy.createdAt = "desc";
  } else if (sort == "oldest") {
    orderBy.createdAt = "asc";
  }

  // Fetch Appoinments with populated Category
  const Appoinments = await prisma.Appoinment.findMany({
    where,
    skip,
    take: limit,
    orderBy,
    include: {
      category: true,
    },
  });

  const result = Appoinments.map(async (Appoinment) => {
    const { category, ...rest } = Appoinment;
    const Category = await prisma.category.findFirst({
      where: { baseId: category!.baseId, lang: lang },
    });

    return {
      ...rest,
      category: Category,
    };
  });
  const formattedResultPromise = await Promise.all(result);

  // Count for pagination
  const total = await prisma.Appoinment.count({ where });
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

const getOneAppoinment = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const AppoinmentId = searchParams.get("baseId");
  const lang = (searchParams.get("lang") || "en") as Language;

  if (!AppoinmentId) throw ApiErrors.BadRequest("Appoinment baseID is missing");

  // Check if Appoinment exists
  const isExistAppoinment = await prisma.Appoinment.findUnique({
    where: {
      baseId_lang_unique: { baseId: AppoinmentId, lang },
    },

    include: {
      category: true,
      author: true,
    },
  });

  if (!isExistAppoinment) throw ApiErrors.NotFound("Appoinment not found");
  const Category = await prisma.category.findFirst({
    where: { baseId: isExistAppoinment!.category!.baseId, lang: lang },
  });

  isExistAppoinment.category = Category;

  return isExistAppoinment;
};

// get Pin Featured Appoinment
const getForHomePage = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const searchParamsObj = Object.fromEntries(searchParams.entries());

  const lang = (searchParamsObj.lang || "en") as Language;

  const isPinHero = await fetchAppoinment(
    {
      isPublished: true,
      isPinHero: true,
    },
    lang,
    3
  );

  const getFeatured = await fetchAppoinment(
    {
      isPublished: true,
      isPinFeatured: true,

      OR: [
        {
          isFeatured: true,
        },
      ],
    },
    lang,
    4
  );

  const getLatest = await fetchAppoinment(
    {
      isPublished: true,
      isPinLatest: true,
      OR: [
        {
          isLatest: true,
        },
      ],
    },
    lang,
    5
  );

  return {
    isPinHero: isPinHero,
    isPinFeatured: getFeatured,
    isPinLatest: getLatest,
  };
};

// getForNavbar
const getForNavbar = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const lang = (searchParams.get("lang") || "en") as Language;

  const [upcomingRaw, latestRaw, emerging, ai] = await Promise.all([
    fetchAppoinment({ isGadget: true, isUpComing: true, isPinNav: true }, lang, 3),
    fetchAppoinment({ isGadget: true, isLatest: true, isPinNav: true }, lang, 3),
    fetchAppoinment(
      { isHotTech: true, isEmergingTech: true, isPinNav: true },
      lang,
      6
    ),
    fetchAppoinment(
      {
        isHotTech: true,
        isPinNav: true,

        OR: [
          {
            category: {
              is: {
                name: { equals: "Ai", mode: "insensitive" },
              },
            },
          },
          {
            category: {
              is: {
                name: { equals: "Machine Learning", mode: "insensitive" },
              },
            },
          },
        ],
      },
      lang,
      6
    ),
  ]);

  const data = {
    navGadget: {
      latest: latestRaw,
      upcoming: upcomingRaw,
    },
    navHotTech: {
      emerging,
      ai,
    },
  };

  return data;
};

export const AppoinmentService = {
  createAppoinment,
  deleteAppoinment,
  updateAppoinment,
  getAllAppoinment,
  getAllFeaturedAppoinment,
  getAllLatestAppoinment,
  getForHomePage,
  getForNavbar,
  getOneAppoinment,
};
