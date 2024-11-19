import { CallbackWithoutResultAndOptionalError, Document } from "mongoose";

/**
 * Only update the updated_at field of the document
 * @param this Document
 * @param next CallbackWithoutResultAndOptionalError
 */
export default function updateTimestamp(
  this: Document,
  next: CallbackWithoutResultAndOptionalError
) {
  this.set({ updated_at: new Date() });
  next();
}
