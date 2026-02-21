import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";

export default function CookiesPage() {
  return (
    <main>
      <section className="py-20 bg-primary text-primary-foreground">
        <Container>
          <Heading level={1} className="text-primary-foreground">
            Cookie Policy
          </Heading>
        </Container>
      </section>

      <section className="py-16">
        <Container size="sm">
          <article className="prose prose-lg max-w-none text-foreground-muted">
            <h2 className="text-2xl font-bold mt-8 mb-4">What are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer by websites that you
              visit. They are widely used in order to make websites work, or work more efficiently,
              as well as to provide information to the owners of the site.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Cookies</h2>
            <p>
              QTO Development uses cookies and similar tracking technologies to track activity on
              our website and store certain information. This information is used to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Identify you and your preferences on future visits</li>
              <li>Understand how you use our website</li>
              <li>Improve and optimize our services</li>
              <li>Analyze trends and statistics</li>
              <li>Monitor website performance</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Types of Cookies We Use</h2>

            <h3 className="text-xl font-bold mt-6 mb-3">Necessary Cookies</h3>
            <p>
              These cookies are essential for the website to function properly. They enable basic
              functions like page navigation and access to secure areas of the website.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Analytics Cookies</h3>
            <p>
              These cookies collect information about how you use our website, such as which pages
              you visit and how long you spend on them. This information is aggregated and
              anonymous.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Marketing Cookies</h3>
            <p>
              These cookies track your online activity to help advertisers deliver more relevant
              advertising or to limit how many times you see an ad.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Managing Your Cookies</h2>
            <p>
              You can control and/or delete cookies as you wish. You can delete all cookies that
              are already on your computer and you can set most browsers to prevent them from being
              placed. However, if you do this, you may have to manually adjust some preferences
              every time you visit our website.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about our cookie policy, please contact us at:
              <br />
              <strong>Email:</strong> cookies@qtodev.com
            </p>
          </article>
        </Container>
      </section>
    </main>
  );
}
