import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";

export default function PrivacyPage() {
  return (
    <main>
      <section className="py-20 bg-primary text-primary-foreground">
        <Container>
          <Heading level={1} className="text-primary-foreground">
            Privacy Policy
          </Heading>
        </Container>
      </section>

      <section className="py-16">
        <Container size="sm">
          <article className="prose prose-lg max-w-none text-foreground-muted">
            <h2 className="text-2xl font-bold mt-8 mb-4">Introduction</h2>
            <p>
              QTO Development ("we", "our", or "us") operates the qtodev.com website (the
              "Service"). This page informs you of our policies regarding the collection, use,
              and disclosure of personal data when you use our Service and the choices you have
              associated with that data.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Information Collection and Use</h2>
            <p>
              We collect several different types of information for various purposes to provide
              and improve our Service to you.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Types of Data Collected</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal Data: Name, email address, phone number</li>
              <li>Usage Data: Pages visited, time spent on pages, referral sources</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Use of Data</h2>
            <p>
              QTO Development uses the collected data for various purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer support and respond to inquiries</li>
              <li>To gather analysis or valuable information to improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Security of Data</h2>
            <p>
              The security of your data is important to us but remember that no method of
              transmission over the Internet or method of electronic storage is 100% secure.
              While we strive to use commercially acceptable means to protect your Personal
              Data, we cannot guarantee its absolute security.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <strong>Email:</strong> privacy@qtodev.com
            </p>
          </article>
        </Container>
      </section>
    </main>
  );
}
