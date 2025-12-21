import { GadgetTypeController } from "@/app/(backend)/_modules/gadget/type/gadgetType.controller";

export const POST = GadgetTypeController.createGadgetType;

export const GET = GadgetTypeController.getAllGadgetType;

export const PATCH = GadgetTypeController.updateGadgetType;
export const DELETE = GadgetTypeController.deleteGadgetType;
