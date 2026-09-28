type FieldErrors = Record<string, string[] | undefined>;

type ApiErrorBody = {
  error?: string;
  fieldErrors?: FieldErrors;
};

export class ApiError extends Error {
  status: number;
  fieldErrors?: FieldErrors;

  constructor(message: string, status: number, fieldErrors?: FieldErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const body = (data ?? {}) as ApiErrorBody;

    throw new ApiError(
      body.error ?? "Something went wrong. Please try again.",
      response.status,
      body.fieldErrors
    );
  }

  return data as T;
}