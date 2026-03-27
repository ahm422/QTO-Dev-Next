import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

type ErrorDetails = Record<string, unknown>;

type MappedApiError = {
  status: number;
  error: string;
  details?: ErrorDetails;
};

export function apiSuccess<T extends Record<string, unknown>>(
  details?: T,
  status = 200
) {
  return NextResponse.json(
    details ? { success: true, details } : { success: true },
    { status }
  );
}

export function apiError(
  status: number,
  error: string,
  details?: ErrorDetails
) {
  return NextResponse.json(
    details ? { success: false, error, details } : { success: false, error },
    { status }
  );
}

export function mapApiError(error: unknown): MappedApiError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        status: 409,
        error: "Conflict",
        details: { code: error.code, message: "A record with this value already exists" },
      };
    }

    if (error.code === "P2025") {
      return {
        status: 404,
        error: "Not found",
        details: { code: error.code, message: "Requested record was not found" },
      };
    }

    if (
      error.code === "P2000" ||
      error.code === "P2005" ||
      error.code === "P2006" ||
      error.code === "P2007" ||
      error.code === "P2011" ||
      error.code === "P2012" ||
      error.code === "P2013" ||
      error.code === "P2019"
    ) {
      return {
        status: 400,
        error: "Invalid request",
        details: { code: error.code, message: "Submitted data is invalid" },
      };
    }

    if (error.code === "P2003") {
      return {
        status: 409,
        error: "Conflict",
        details: { code: error.code, message: "Request conflicts with related data constraints" },
      };
    }

    return {
      status: 500,
      error: "Database error",
      details: { code: error.code, message: "The database request could not be completed" },
    };
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      status: 400,
      error: "Invalid request",
      details: { message: "Submitted data failed database validation" },
    };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      status: 503,
      error: "Service unavailable",
      details: { message: "Database service is temporarily unavailable" },
    };
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return {
      status: 500,
      error: "Internal server error",
    };
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      status: 500,
      error: "Database error",
    };
  }

  return {
    status: 500,
    error: "Internal server error",
  };
}

export function logApiError(route: string, error: unknown) {
  const includeMessage = process.env.NODE_ENV !== "production";

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[${route}] Prisma known request error`, {
      code: error.code,
      name: error.name,
      ...(includeMessage ? { message: error.message } : {}),
    });
    return;
  }

  if (error instanceof Error) {
    console.error(`[${route}] Unexpected error`, {
      name: error.name,
      ...(includeMessage ? { message: error.message } : {}),
    });
    return;
  }

  console.error(`[${route}] Non-error exception`, {
    type: typeof error,
  });
}
