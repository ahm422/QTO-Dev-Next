import { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "getting-started-nextjs",
    title: "Getting Started with Next.js 14",
    description: "Learn how to build fast web applications with Next.js 14 and modern features",
    excerpt: "Discover the latest features in Next.js 14 including App Router, Server Components, and more.",
    content: `
      <h2>Introduction to Next.js 14</h2>
      <p>Next.js 14 introduces several groundbreaking features that make building production-ready applications easier than ever.</p>
      <h3>Key Features</h3>
      <ul>
        <li>Enhanced App Router with improved performance</li>
        <li>Server Components by default</li>
        <li>Optimized image handling</li>
        <li>Better TypeScript support</li>
      </ul>
      <h2>Getting Started</h2>
      <p>To get started with Next.js 14, first ensure you have Node.js 18+ installed on your machine.</p>
      <blockquote>Next.js makes it easy to create full-stack applications with flexibility where you need it.</blockquote>
      <h3>Installation</h3>
      <p>Use the create-next-app CLI tool to scaffold a new project:</p>
      <pre><code>npx create-next-app@latest my-app --typescript</code></pre>
    `,
    author: "John Doe",
    publishedAt: "2024-02-15",
    updatedAt: "2024-02-15",
    featured: true,
    category: "Web Development",
    tags: ["Next.js", "React", "Tutorial"],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop",
    coverImage: {
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop",
      alt: "Getting Started with Next.js 14"
    },
    readingTime: 8,
  },
  {
    id: "2",
    slug: "performance-optimization-tips",
    title: "Web Performance Optimization Tips",
    description: "Essential techniques to make your website faster and more responsive",
    excerpt: "Master essential performance optimization techniques to improve Core Web Vitals and user experience.",
    content: `
      <h2>Why Performance Matters</h2>
      <p>Web performance is crucial for user satisfaction and SEO rankings. A slow website loses users and revenue.</p>
      <h3>Core Web Vitals</h3>
      <ul>
        <li>Largest Contentful Paint (LCP)</li>
        <li>First Input Delay (FID)</li>
        <li>Cumulative Layout Shift (CLS)</li>
      </ul>
      <h2>Optimization Strategies</h2>
      <p>Here are proven strategies to optimize your website's performance:</p>
      <blockquote>Performance is not just a technical concern; it directly impacts your bottom line.</blockquote>
      <h3>Image Optimization</h3>
      <p>Always optimize your images for the web using modern formats like WebP and responsive sizes.</p>
    `,
    author: "Jane Smith",
    publishedAt: "2024-02-10",
    updatedAt: "2024-02-10",
    featured: true,
    category: "Performance",
    tags: ["Performance", "Optimization", "Web Vitals"],
    image: "https://images.unsplash.com/photo-1516534775068-bb57e5ab928e?w=800&h=400&fit=crop",
    coverImage: {
      url: "https://images.unsplash.com/photo-1516534775068-bb57e5ab928e?w=1200&h=600&fit=crop",
      alt: "Web Performance Optimization"
    },
    readingTime: 12,
  },
  {
    id: "3",
    slug: "react-best-practices",
    title: "React Best Practices 2024",
    description: "Modern React patterns and best practices for building scalable applications",
    excerpt: "Learn the best practices for React development in 2024, including hooks, state management, and performance optimization.",
    content: `
      <h2>React Best Practices</h2>
      <p>React has evolved significantly, and staying updated with best practices is essential for building maintainable applications.</p>
      <h3>Functional Components</h3>
      <ul>
        <li>Always use functional components over class components</li>
        <li>Leverage React Hooks for state and side effects</li>
        <li>Keep components small and focused</li>
      </ul>
      <h2>State Management</h2>
      <p>Choose the right state management solution for your application needs.</p>
      <blockquote>Good state management is the foundation of a scalable React application.</blockquote>
      <h3>Performance Optimization</h3>
      <p>Use React.memo, useMemo, and useCallback judiciously to optimize rendering.</p>
    `,
    author: "Mike Johnson",
    publishedAt: "2024-02-05",
    updatedAt: "2024-02-05",
    featured: false,
    category: "React",
    tags: ["React", "Best Practices", "JavaScript"],
    image: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&h=400&fit=crop",
    coverImage: {
      url: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=1200&h=600&fit=crop",
      alt: "React Best Practices"
    },
    readingTime: 10,
  },
  {
    id: "4",
    slug: "tailwind-css-guide",
    title: "Complete Guide to Tailwind CSS",
    description: "Master Tailwind CSS and build beautiful UIs with utility-first approach",
    excerpt: "A comprehensive guide to Tailwind CSS - learn how to build modern, responsive UIs with utility-first CSS.",
    content: `
      <h2>Introduction to Tailwind CSS</h2>
      <p>Tailwind CSS has revolutionized the way we write CSS by providing a comprehensive set of utility classes.</p>
      <h3>Key Concepts</h3>
      <ul>
        <li>Utility-first approach</li>
        <li>Responsive design with breakpoints</li>
        <li>Dark mode support</li>
        <li>Customization through config</li>
      </ul>
      <h2>Getting Started</h2>
      <p>Install Tailwind CSS in your project and start building beautiful UIs.</p>
      <blockquote>Tailwind CSS lets you build modern designs without leaving your HTML.</blockquote>
      <h3>Best Practices</h3>
      <p>Organize your CSS effectively by using utility classes wisely and extracting custom components when needed.</p>
    `,
    author: "Sarah Williams",
    publishedAt: "2024-01-30",
    updatedAt: "2024-01-30",
    featured: false,
    category: "CSS",
    tags: ["Tailwind CSS", "CSS", "Styling"],
    image: "https://images.unsplash.com/photo-1518611505868-d7380f0ce2e2?w=800&h=400&fit=crop",
    coverImage: {
      url: "https://images.unsplash.com/photo-1518611505868-d7380f0ce2e2?w=1200&h=600&fit=crop",
      alt: "Tailwind CSS Guide"
    },
    readingTime: 15,
  },
];
