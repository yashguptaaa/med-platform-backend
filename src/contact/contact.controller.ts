import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as contactService from "./contact.service";

const submitContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await contactService.submitContact(req.body);
    res.sendSuccess(result, StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

export {
  submitContact,
};
