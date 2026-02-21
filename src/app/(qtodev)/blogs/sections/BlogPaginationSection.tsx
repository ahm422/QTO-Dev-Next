import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/shared/Button";

export function BlogPaginationSection() {
  return (
    <section className="py-12 bg-surface">
      <Container>
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="md">
            ← Previous
          </Button>
          <div className="flex gap-2">
            {[1, 2, 3].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "primary" : "outline"}
                size="sm"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="md">
            Next →
          </Button>
        </div>
      </Container>
    </section>
  );
}
