import { blogPosts } from "@/data/blog";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/shared/Card";
import { Badge } from "@/components/ui/shared/Badge";

export function BlogGridSection() {
  return (
    <section className="py-16">
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blogs/${post.slug}`}>
              <Card className="overflow-hidden h-full hover:shadow-lg cursor-pointer">
                <div className="h-40 bg-gradient-to-br from-blue-300 to-purple-300"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" size="sm">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-foreground-muted">{post.readingTime}m</span>
                  </div>
                  <h3 className="font-bold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-foreground-muted">
                    <span>{post.author}</span>
                    <span>{post.publishedAt}</span>
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
