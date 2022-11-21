export const isError = (err: unknown): err is Error => err instanceof Error;
export const isErrorsInline = (
  target: unknown,
): target is Record<string, string | null | undefined> => !isError(target);
