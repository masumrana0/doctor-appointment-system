/**
 * Title: 'Send api Response '
 * Description: ''
 * Author: 'Masum Rana'
 * createdAt: 27-12-2023
 *
 */

import { NextResponse } from "next/server";

type IApiResponse<T> = {
  statusCode: number;
  success?: boolean;
  message?: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T | null;
};

const sendResponse = <T>(data: IApiResponse<T>) => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: true,
    message: data.message || null,
    meta: data.meta || null || undefined,
    data: data.data || null || undefined,
  };

  return NextResponse.json(responseData, { status: responseData.statusCode });
};

export default sendResponse;
