import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/shared/Card";

export function ContactDetailsSection() {
  const contactMethods = [
    {
      icon: "📧",
      title: "Email",
      description: "hello@qtodev.com",
      detail: "We'll respond within 24 hours",
    },
    {
      icon: "📞",
      title: "Phone",
      description: "+1 (555) 123-4567",
      detail: "Monday to Friday, 9am-5pm EST",
    },
    {
      icon: "📍",
      title: "Office",
      description: "123 Tech Street, San Francisco, CA 94105",
      detail: "Visit us for a personal meeting",
    },
  ];

  return (
    <section className="py-16 bg-surface">
      <Container>
        <h2 className="text-3xl font-bold mb-12 text-center">Other Ways to Reach Us</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {contactMethods.map((method, i) => (
            <Card key={i} className="p-8 text-center hover:shadow-lg">
              <div className="text-5xl mb-4">{method.icon}</div>
              <h3 className="text-xl font-bold mb-2">{method.title}</h3>
              <p className="text-lg text-foreground mb-2 font-semibold">
                {method.description}
              </p>
              <p className="text-foreground-muted">{method.detail}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
