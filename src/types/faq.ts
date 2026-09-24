/**
 * FAQs section (issue #32): one FAQ accordion item.
 */

export interface Faq {
  /** The question text shown in the card header */
  question: string;
  /** The answer text shown when expanded */
  answer: string;
}

/** FAQ attached to one Blog post or Service. Plain text only. */
export interface ContentFaq {
  question: string
  answer: string
}
