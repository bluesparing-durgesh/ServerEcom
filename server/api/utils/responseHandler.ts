import { Response } from "express";
import { ErrorResponseType } from "../types/errorType";

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  msg: string
) => {
  const errorResponse: ErrorResponseType = {
    success: false,
    msg,
    statusCode,
  };

  return res.status(statusCode).send(errorResponse);
};