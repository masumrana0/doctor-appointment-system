import { GadgetBrandController } from "@/app/(backend)/_modules/gadget/brand/gadgetBand.controller";

export const POST = GadgetBrandController.createGadgetBrand;

export const GET = GadgetBrandController.getAllGadgetBrand;

export const PATCH = GadgetBrandController.updateGadgetBrand;
export const DELETE = GadgetBrandController.deleteGadgetBrand;
