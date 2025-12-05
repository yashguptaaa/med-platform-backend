import { Router } from "express";
import { submitContact } from "./contact.controller";
import { validateRequest } from "@/middleware/validateRequest";
import { contactSchema } from "./contact.validator";

export const contactRouter = Router();

contactRouter.post("/", validateRequest(contactSchema), submitContact);

