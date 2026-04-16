import { FunctionsHttpError } from "@supabase/supabase-js";

const FALLBACK =
  "Something went wrong. Please try again or email us directly at info@uxsupportgroup.com";

/**
 * Turns supabase.functions.invoke errors into user-facing copy.
 * Notably, a missing Edge Function deployment returns 404 NOT_FOUND from the gateway.
 */
export async function describeFunctionInvokeError(error: unknown): Promise<string> {
  if (!(error instanceof FunctionsHttpError)) {
    return error instanceof Error && error.message ? error.message : FALLBACK;
  }

  const res = error.context;
  let bodyText = "";
  try {
    bodyText = await res.clone().text();
  } catch {
    return FALLBACK;
  }

  let parsed: { code?: string; message?: string; error?: string } | null = null;
  try {
    parsed = JSON.parse(bodyText) as { code?: string; message?: string; error?: string };
  } catch {
    /* not JSON */
  }

  if (res.status === 404 && parsed?.code === "NOT_FOUND") {
    return "This form is temporarily unavailable. Please email info@uxsupportgroup.com and we will get back to you.";
  }

  if (res.status === 401 || res.status === 403) {
    return "We could not verify your request. Please refresh the page and try again, or email info@uxsupportgroup.com.";
  }

  if (parsed?.error && typeof parsed.error === "string") {
    return parsed.error;
  }

  if (parsed?.message && typeof parsed.message === "string") {
    return parsed.message;
  }

  return FALLBACK;
}
