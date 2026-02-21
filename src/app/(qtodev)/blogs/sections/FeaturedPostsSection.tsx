import { blogPosts } from "@/data/blog";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/shared/Card";
import { Badge } from "@/components/ui/shared/Badge";

export function FeaturedPostsSection() {
  const featured = blogPosts.filter((p) => p.featured).slice(0, 2);

  return (
    <section className="py-16 bg-surface">
      <Container>
        <h2 className="text-3xl font-bold mb-12">Featured Articles</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {featured.map((post) => (
            <Link key={post.id} href={`/blogs/${post.slug}`}>
              <Card className="overflow-hidden h-full hover:shadow-lg cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-400"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="primary">{post.category}</Badge>
                    <span className="text-sm text-foreground-muted">{post.readingTime} min read</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                  <p className="text-foreground-muted mb-4">{post.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground-muted">{post.author}</span>
                    <span className="text-sm text-foreground-muted">{post.publishedAt}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
