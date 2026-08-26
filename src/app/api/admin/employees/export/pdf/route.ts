import { NextRequest } from "next/server"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { prisma } from "@/lib/prisma"
import { apiError, logApiError } from "@/lib/apiResponses"
import { requireAdminSession } from "@/lib/api/requireAdminSession"

const EMPLOYEE_ROLES = ["super_admin", "hr"] as const

// A4 in points, 24pt margins, 170x230pt cards, 12pt gaps.
const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN = 24
const CARD_WIDTH = 170
const CARD_HEIGHT = 230
const GAP = 12

const USABLE_WIDTH = PAGE_WIDTH - MARGIN * 2
const USABLE_HEIGHT = PAGE_HEIGHT - MARGIN * 2
const COLUMNS = Math.max(1, Math.floor((USABLE_WIDTH + GAP) / (CARD_WIDTH + GAP)))
const ROWS = Math.max(1, Math.floor((USABLE_HEIGHT + GAP) / (CARD_HEIGHT + GAP)))
const CARDS_PER_PAGE = COLUMNS * ROWS

export async function GET(request: NextRequest) {
  const { error } = await requireAdminSession({ allowedRoles: [...EMPLOYEE_ROLES] })
  if (error) return error

  const { searchParams } = new URL(request.url)
  const ids = (searchParams.get("ids") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)

  if (ids.length === 0) return apiError(400, "ids query param is required")

  try {
    const employees = await prisma.employee.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, designation: true, employeeCode: true, qrKey: true },
      orderBy: { createdAt: "desc" },
    })
    if (employees.length === 0) return apiError(404, "No matching employees found")

    let env: { MEDIA?: R2Bucket } | null = null
    try {
      ;({ env } = await getCloudflareContext({ async: true }))
    } catch {
      env = null
    }

    const pdf = await PDFDocument.create()
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
    const regular = await pdf.embedFont(StandardFonts.Helvetica)

    for (let i = 0; i < employees.length; i += CARDS_PER_PAGE) {
      const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
      const pageEmployees = employees.slice(i, i + CARDS_PER_PAGE)

      for (let j = 0; j < pageEmployees.length; j++) {
        const employee = pageEmployees[j]!
        const col = j % COLUMNS
        const row = Math.floor(j / COLUMNS)
        const x = MARGIN + col * (CARD_WIDTH + GAP)
        // PDF y-origin is bottom-left; lay rows out top-down.
        const y = PAGE_HEIGHT - MARGIN - CARD_HEIGHT - row * (CARD_HEIGHT + GAP)

        page.drawRectangle({
          x,
          y,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 1,
        })

        let qrBottomY = y + CARD_HEIGHT - 14 - 100
        if (employee.qrKey && env?.MEDIA) {
          try {
            const object = await env.MEDIA.get(employee.qrKey)
            if (object) {
              const bytes = await object.arrayBuffer()
              const qrImage = await pdf.embedPng(bytes)
              const qrSize = 100
              page.drawImage(qrImage, {
                x: x + (CARD_WIDTH - qrSize) / 2,
                y: qrBottomY,
                width: qrSize,
                height: qrSize,
              })
            }
          } catch (err) {
            logApiError("employees/export/pdf:qr", err)
          }
        } else {
          qrBottomY = y + CARD_HEIGHT - 14 - 100
        }

        const textTop = qrBottomY - 16
        page.drawText(employee.name, {
          x: x + 10,
          y: textTop,
          size: 12,
          font: bold,
          maxWidth: CARD_WIDTH - 20,
          color: rgb(0.1, 0.1, 0.1),
        })
        if (employee.designation) {
          page.drawText(employee.designation, {
            x: x + 10,
            y: textTop - 16,
            size: 9,
            font: regular,
            maxWidth: CARD_WIDTH - 20,
            color: rgb(0.35, 0.35, 0.35),
          })
        }
        page.drawText(employee.employeeCode, {
          x: x + 10,
          y: textTop - 32,
          size: 9,
          font: regular,
          maxWidth: CARD_WIDTH - 20,
          color: rgb(0.5, 0.5, 0.5),
        })
      }
    }

    const bytes = await pdf.save()
    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="employee-badges.pdf"`,
      },
    })
  } catch (e) {
    logApiError("GET /api/admin/employees/export/pdf", e)
    return apiError(500, "Failed to generate PDF")
  }
}
