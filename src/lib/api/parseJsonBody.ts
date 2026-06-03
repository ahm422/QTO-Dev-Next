import { NextRequest } from "next/server";
import { apiError } from "@/lib/apiResponses";

export async function parseJsonBody(request: NextRequest) {
  try {
    return { body: await request.json(), error: null };
  } catch {
    return { body: null, error: apiError(400, "Invalid JSON body") };
  }
}
