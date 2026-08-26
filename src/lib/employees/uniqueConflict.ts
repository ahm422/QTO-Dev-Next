import { Prisma } from "@prisma/client";
import { apiError } from "@/lib/apiResponses";

const FIELD_BY_COLUMN: Record<string, { field: string; label: string }> = {
  cnic: { field: "cnic", label: "An employee with this CNIC already exists" },
  employee_code: { field: "employeeCode", label: "An employee with this code already exists" },
  public_id: { field: "publicId", label: "Public ID collision — please retry" },
};

/**
 * Maps a Prisma P2002 unique-constraint violation on Employee.cnic /
 * .employeeCode / .publicId to a 409 with a field-specific message, per
 * #414 ("catch P2002, return 409 with a field-specific message, not a raw
 * 500"). Returns null for any other error so the caller falls through to
 * the generic handleRouteError path.
 */
export function mapEmployeeUniqueConflict(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
    return null;
  }
  const target = error.meta?.target;
  const targetStr = Array.isArray(target) ? target.join(",") : String(target ?? "");
  const hit = Object.entries(FIELD_BY_COLUMN).find(([column]) => targetStr.includes(column));
  if (!hit) return null;
  const { field, label } = hit[1];
  return apiError(409, "Conflict", { fieldErrors: { [field]: [label] } });
}
