/**
 * Centralized site configuration object.
 * Contains all site-wide settings, metadata, and contact information.
 * This file serves as a single source of truth for site configuration.
 */
export const siteConfig = {
  /** Site name displayed in navigation, titles, and metadata */
  name: "Nazar's Portfolio",

  /** Site description used in metadata and SEO */
  description:
    "A professional portfolio and blog showcasing development projects and insights",

  /** Site URL (used for canonical links and sitemap) */
  url: "https://your-domain.com",

  /** Author information for SEO and metadata */
  author: {
    name: "Nazar Zhyliuk",
    email: "nazar12522@gmail.com",
    title: "Data & AI Engineer",
    description:
      "I design reliable data pipelines (DAGs) and build AI‑powered web apps.",
    keywords: [
      "Airflow",
      "Prefect",
      "Dagster",
      "LLMs",
      "RAG",
      "Next.js",
      "TypeScript",
    ],
    highlights: ["Airflow/Prefect", "Dagster", "RAG", "Next.js", "Firebase"],
  },

  /** Social media links displayed in footer and contact sections */
  social: {
    github: "https://github.com/softK1T",
    linkedin: "https://linkedin.com/in/nazar-zhyliuk",
    email: "mailto:nazar12522@gmail.com",
  },

  /** Navigation links for the main menu */
  navigation: [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
  ],

  /** Footer links organized by category */
  footer: {
    links: [
      {
        title: "Portfolio",
        links: [
          { name: "Projects", href: "/portfolio" },
          { name: "About", href: "/#about" },
        ],
      },
      {
        title: "Blog",
        links: [
          { name: "All Posts", href: "/blog" },
          { name: "Development", href: "/blog?tag=development" },
        ],
      },
      {
        title: "Connect",
        links: [
          { name: "GitHub", href: "https://github.com/softK1T" },
          { name: "LinkedIn", href: "https://linkedin.com/in/nazar-zhyliuk" },
          { name: "Email", href: "mailto:nazar12522@gmail.com" },
        ],
      },
    ],
  },

  /** SEO metadata configuration */
  seo: {
    /** Default title template for pages */
    titleTemplate: "%s | Nazar's Portfolio",

    /** Default meta description */
    defaultDescription:
      "A professional portfolio and blog showcasing development projects and insights",

    /** Open Graph image URL */
    openGraphImage: "/og-image.jpg",

    /** Twitter card type */
    twitterCard: "summary_large_image",
  },

  /** Contact information displayed on the homepage */
  contact: {
    email: "nazar12522@gmail.com",
    location: "Poland",
    availability: "Available for new opportunities",
  },

  /** Skills and technologies organized by category */
  skills: {
    frontend: [
      "React",
      "Next.js",
      "Vite",
      "TypeScript",
      "Tailwind CSS",
      "shadcn",
    ],
    backend: ["Python", "FastAPI", "Ruby", "Node.js", "C#", "Java"],
    dataOrchestration: [
      "Apache Airflow",
      "ETL/ELT design",
      "SQL",
      "SQLAlchemy",
      "PostgreSQL",
      "Pandas",
    ],
    devopsCloud: [
      "Docker & Docker Compose",
      "Google Cloud",
      "AWS S3",
      "Vercel",
      "Nginx",
    ],
    tools: ["Git", "Jira & Confluence", "BeautifulSoup", "Prisma"],
    softSkills: ["Cross‑functional collaboration", "Problem solving"],
    languages: ["English", "Polish", "Ukrainian", "Russian"],
  },
} as const;

/**
 * Type definition for the site configuration object.
 * Ensures type safety when accessing configuration properties.
 */
export type SiteConfig = typeof siteConfig;
