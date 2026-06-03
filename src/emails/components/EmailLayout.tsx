import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/constants";

type EmailLayoutProps = {
  title: string;
  children: ReactNode;
};

export function EmailLayout({ title, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>{SITE_NAME}</Heading>
          <Text style={subtitle}>{title}</Text>
          <Hr style={hr} />
          {children}
          <Hr style={hr} />
          <Text style={footer}>
            <Link href={SITE_URL} style={link}>
              {SITE_URL.replace(/^https?:\/\//, "")}
            </Link>
            {" · "}
            <Link href={`mailto:${CONTACT_EMAIL}`} style={link}>
              {CONTACT_EMAIL}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f6f6f6",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: "0",
  padding: "24px 0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "32px 24px",
};

const heading = {
  color: "#111111",
  fontSize: "22px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "0 0 8px",
};

const subtitle = {
  color: "#444444",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 16px",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "24px 0",
};

const footer = {
  color: "#666666",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0",
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};
