import { NextResponse } from "next/server";
import { GlobalErrorHandler } from "../error-handler/global-error-handler/global-error-handler";

type AsyncHandler = (req: Request) => Promise<NextResponse>;

const catchAsync =
  (fn: AsyncHandler): AsyncHandler =>
  async (req: any): Promise<NextResponse> => {
    try {
      return await fn(req);
    } catch (error: any) {
      return GlobalErrorHandler(error);
    }
  };

export default catchAsync;
