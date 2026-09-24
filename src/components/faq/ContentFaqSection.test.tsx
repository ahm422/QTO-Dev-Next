// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { ContentFaqSection } from "./ContentFaqSection"

afterEach(() => {
  cleanup()
})

describe("ContentFaqSection", () => {
  it("renders no section for an empty list", () => {
    const { container } = render(<ContentFaqSection items={[]} idPrefix="blog-faq" />)
    expect(container.querySelector("section")).toBeNull()
    expect(screen.queryByRole("heading")).toBeNull()
  })

  it("renders the heading and each question when items exist", () => {
    render(
      <ContentFaqSection
        idPrefix="service-faq"
        items={[
          { question: "What is included?", answer: "Design and build." },
          { question: "How long does it take?", answer: "It depends." },
        ]}
      />
    )
    expect(screen.getByRole("heading", { name: "Frequently Asked Questions" }).tagName).toBe("H2")
    expect(screen.getByText("What is included?")).toBeTruthy()
    expect(screen.getByText("How long does it take?")).toBeTruthy()
  })
})