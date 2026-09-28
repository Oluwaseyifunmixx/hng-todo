import { NextResponse } from "next/server";
import { z, type ZodError } from "zod";

type FieldErrors = Record<string, string[] | undefined>;

export function jsonError(
  message: string,
  status: number,
  fieldErrors?: FieldErrors
) {
  return NextResponse.json(
    { error: message, ...(fieldErrors && { fieldErrors }) },
    { status }
  );
}

export function validationError(error: ZodError) {
  return jsonError("Invalid input", 400, z.flattenError(error).fieldErrors);
}