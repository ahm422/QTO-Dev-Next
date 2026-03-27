import { ContactLayout } from "@/components/contact/ContactLayout";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { Text } from "@/components/ui/shared/Text";
import { ClientQuestionnaireForm } from "@/components/client-questionnaire/ClientQuestionnaireForm";

export default function ClientQuestionnairePage() {
  return (
    <main>
      <ContactLayout
        eyebrow="Client questionnaire"
        title="QTODEV client requirement questionnaire"
        subtitle="Complete this form to help us understand your business goals and deliver the right solution tailored to your needs."
        size="xl"
        sideContent={
          <>
            <TrustStrip orientation="column" />
            <div className="mt-6 space-y-3 text-sm text-foreground-muted">
              <p className="font-semibold text-foreground">What happens next</p>
              <Text color="muted">
                Our team reviews your answers and follows up with questions or a
                tailored proposal—usually within one to two business days.
              </Text>
            </div>
          </>
        }
      >
        <ClientQuestionnaireForm />
      </ContactLayout>
    </main>
  );
}
