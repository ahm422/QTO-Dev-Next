import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Terms of Service | QTO Dev",
  description:
    "Terms governing your use of the QTO Dev website and engagement with our development and design services.",
  url: "/terms",
});

export default function TermsPage() {
  return (
    <main>
      <section className="py-20 bg-primary text-primary-foreground">
        <Container>
          <Heading level={1} className="text-primary-foreground">
            Terms of Service
          </Heading>
        </Container>
      </section>

      <section className="py-16">
        <Container size="sm">
          <article className="prose-style prose-lg max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4">Agreement to Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to abide by the above, please
              do not use this service.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information
              or software) on QTO Development's website for personal, non-commercial transitory
              viewing only. This is the grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modifying or copying the materials</li>
              <li>
                Using the materials for any commercial purpose or any public display (commercial
                or non-commercial)
              </li>
              <li>
                Attempting to decompile or reverse engineer any software contained on the website
              </li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Disclaimer</h2>
            <p>
              The materials on QTO Development's website are provided on an 'as is' basis.
              QTO Development makes no warranties, expressed or implied, and hereby disclaims and
              negates all other warranties including, without limitation, implied warranties or
              conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Limitations</h2>
            <p>
              In no event shall QTO Development or its suppliers be liable for any damages
              (including, without limitation, damages for loss of data or profit, or due to
              business interruption) arising out of the use or inability to use the materials on
              QTO Development's website, even if QTO Development or an authorized representative
              has been notified orally or in writing of the possibility of such damage.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Accuracy of Materials</h2>
            <p>
              The materials appearing on QTO Development's website could include technical,
              typographical, or photographic errors. QTO Development does not warrant that any of
              the materials on its website are accurate, complete, or current. QTO Development may
              make changes to the materials contained on its website at any time without notice.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Links</h2>
            <p>
              QTO Development has not reviewed all of the sites linked to its website and is not
              responsible for the contents of any such linked site. The inclusion of any link does
              not imply endorsement by QTO Development of the site. Use of any such linked website
              is at the user's own risk.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Modifications</h2>
            <p>
              QTO Development may revise these terms of service for its website at any time without
              notice. By using this website, you are agreeing to be bound by the then current
              version of these terms of service.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws
              of the United States and you irrevocably submit to the exclusive jurisdiction of the
              courts located in this location.
            </p>
          </article>
        </Container>
      </section>
    </main>
  );
}
