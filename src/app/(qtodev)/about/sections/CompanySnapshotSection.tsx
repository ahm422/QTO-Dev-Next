import { aboutData } from "@/data/about";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/shared/Card";

export function CompanySnapshotSection() {
  return (
    <section className="py-16 bg-surface">
      <Container>
        <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Founded", value: aboutData.company.founded },
            { label: "Team Members", value: aboutData.company.team },
            { label: "Happy Clients", value: aboutData.company.clients },
            { label: "Projects Delivered", value: aboutData.company.projects },
          ].map((stat, i) => (
            <Card key={i} className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <p className="text-foreground-muted">{stat.label}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-surface-muted">
          <p className="text-lg text-foreground-muted leading-relaxed">
            Since {aboutData.company.founded}, QTO Development has been at the forefront of
            digital transformation. We've worked with startups to enterprises, delivering
            innovative solutions that solve real business challenges.
          </p>
        </Card>
      </Container>
    </section>
  );
}
