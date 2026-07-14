// Non-translatable structural data: icons, tech names, links, slugs, grades.
// All visible text comes from i18n locales (src/i18n/locales/*.json).

export const profile = {
  name: "Amulya Varshney",
  initials: "AV",
  location: "Bangalore, India",
  social: {
    github: "https://github.com/amulyavarshney",
    linkedin: "https://www.linkedin.com/in/varamu/",
    medium: "https://medium.com/@amulyavarshney7",
  },
  githubUser: "amulyavarshney",
  mediumFeed: "https://medium.com/feed/@amulyavarshney7",
};

// Tech stacks per experience entry (kept in English — proper nouns).
export const experienceStacks: string[][] = [
  ["LangGraph", "Python", "RAG", "Langfuse", "LLMOps", "PostgreSQL"],
  ["Python", "FastAPI", "LangGraph", "Golang", "LLMs", "Multi-Agent"],
  ["Java", "Spring Boot", "gRPC", "C#", "React", "TypeScript"],
];

export const experienceMeta = [
  { current: true },
  { current: false },
  { current: false },
];

// Skill lists per category (technology names — kept in English).
export const skillLists: string[][] = [
  ["Python", "Java", "Golang", "JavaScript", "TypeScript", "C++", "C#", "SQL", "GraphQL"],
  ["LLMs", "RAG", "LangGraph", "AI Agents", "LLMOps", "Embeddings", "Evaluation", "Langfuse"],
  ["Spring Boot", "FastAPI", "Django", "Node.js", "Nest.js", "gRPC"],
  ["React", "Next.js", "Three.js", "Web3.js", "Tailwind CSS", "Microfrontends"],
  ["Git", "Docker", "Kubernetes", "Temporal", "Kafka", "RabbitMQ", "Prometheus", "Grafana"],
  ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Vector DB", "AWS", "Azure", "GCP", "Linux"],
];

export const curatedProjectMeta = [
  {
    stack: ["LangGraph", "Python", "FastAPI", "Langfuse", "PostgreSQL", "RAG", "LLMOps"],
    github: "https://github.com/amulyavarshney",
    caseStudy: "payroll-intelligence-agent",
  },
  {
    stack: ["Python", "FastAPI", "LangGraph", "Golang", "LLMs", "Multi-Agent"],
    github: "https://github.com/amulyavarshney",
    caseStudy: "ray-fintech-concierge",
  },
];

export const achievementIcons = [
  "trophy",
  "zap",
  "award",
  "code",
  "star",
  "target",
  "rocket",
  "sparkles",
] as const;

export const serviceIcons = ["bot", "brain", "layers", "server", "cloud", "graduation-cap"] as const;

export const navItems = [
  { id: "home", path: "/", labelKey: "nav.home" },
  { id: "portfolio", path: "/portfolio", labelKey: "nav.portfolio" },
  { id: "projects", path: "/projects", labelKey: "nav.projects" },
  { id: "services", path: "/services", labelKey: "nav.services" },
  { id: "playground", path: "/playground", labelKey: "nav.playground" },
  { id: "blogs", path: "/blogs", labelKey: "nav.blogs" },
  { id: "contact", path: "/contact", labelKey: "nav.contact" },
];
