// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

import { webDevelopmentServiceData } from "@/content/services/web-development"
import { OverviewSection } from "./OverviewSection"

beforeAll(() => {
  window.matchMedia = (query: string) =>
    ({
      matches: true,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
      onchange: null,
    }) as MediaQueryList
})

afterEach(() => {
  cleanup()
})

describe("OverviewSection", () => {
  it("renders the CMS overview body, including its link, above What We Deliver", () => {
    render(
      <OverviewSection
        service={{
          ...webDevelopmentServiceData,
          overviewText: '<p>See <a href="https://example.com">Example</a>.</p>',
        }}
      />,
    )
    expect(screen.getByRole("heading", { name: "Service Overview" })).toBeTruthy()
    const link = document.querySelector('a[href="https://example.com"]')
    expect(link?.textContent).toBe("Example")
    expect(screen.getByRole("heading", { name: "What We Deliver" })).toBeTruthy()
  })

  it("omits the overview section when overviewText is empty", () => {
    render(
      <OverviewSection
        service={{ ...webDevelopmentServiceData, overviewText: "" }}
      />,
    )
    expect(screen.queryByRole("heading", { name: "Service Overview" })).toBeNull()
    expect(screen.getByRole("heading", { name: "What We Deliver" })).toBeTruthy()
  })
})
