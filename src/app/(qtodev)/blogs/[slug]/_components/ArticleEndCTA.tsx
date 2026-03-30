export function ArticleEndCTA() {
  return (
    <section className="bg-primary py-16 md:py-20 my-16 md:my-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center text-primary-foreground">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Want help implementing this?
        </h2>
        <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
          Our team specializes in building custom solutions tailored to your business needs.
          Let's discuss how we can help.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center sm:items-stretch">
          <a
            href="/contact#book-a-call"
            className="px-8 py-3 bg-primary-foreground text-primary font-semibold rounded-lg hover:opacity-90 transition-colors shadow-lg hover:shadow-xl"
          >
            Book a Call
          </a>
          <a
            href="/services"
            className="px-8 py-3 border-2 border-primary-foreground font-semibold rounded-lg hover:bg-primary-foreground hover:text-primary transition-colors"
          >
            Explore Services
          </a>
        </div>
      </div>
    </section>
  );
}
