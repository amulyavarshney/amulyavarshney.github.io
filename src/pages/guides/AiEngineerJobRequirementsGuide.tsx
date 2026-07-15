import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/portfolio/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbJsonLd, langUrl, SITE_URL } from "@/lib/site";
import { HeroBanner, SkillRadar, InterviewFunnel } from "@/components/guides/Infographics";

const sections = [
  {
    id: "role",
    title: "1. What an AI Engineer Actually Does",
    body: "An AI engineer ships production systems that use machine learning and large language models: RAG pipelines, agent workflows, evaluation loops, and the surrounding APIs. The role sits between ML research and traditional backend engineering. Expect to spend most of your time on data plumbing, evaluation, guardrails, and latency, not on training models from scratch.",
    checklist: [
      "Design and deploy LLM features behind real APIs, not notebooks",
      "Own retrieval quality, hallucination rate, and cost per request",
      "Wire tracing, evals, and regression tests around every prompt",
      "Collaborate with product, data, and platform teams on rollout",
    ],
  },
  {
    id: "core-skills",
    title: "2. Core Technical Skills",
    body: "The strongest candidates combine solid software engineering with hands-on LLM systems experience. Python is table stakes. Beyond that, hiring managers look for people who can design an end-to-end pipeline, reason about cost and latency, and debug a bad answer back to the retrieval step.",
    checklist: [
      "Python (async, typing, packaging) and one systems language (Go or Java)",
      "REST and gRPC APIs with FastAPI, Django, or Spring Boot",
      "Vector databases: Qdrant, Pinecone, pgvector, or Weaviate",
      "Frameworks: LangChain, LangGraph, LlamaIndex, or CrewAI",
      "Prompt engineering patterns: few-shot, ReAct, chain-of-thought, structured outputs",
      "Evaluation: Ragas, Langfuse, promptfoo, or a homegrown harness",
      "Cloud: AWS Bedrock or SageMaker, Azure OpenAI, GCP Vertex AI",
    ],
  },
  {
    id: "ml-foundations",
    title: "3. Machine Learning Foundations You Actually Need",
    body: "You do not need a PhD, but you do need enough theory to make good architecture calls. Know how embeddings work, how attention gives rise to context limits, and how a transformer decodes tokens. That is usually the depth interviews probe.",
    checklist: [
      "Embeddings, cosine similarity, and semantic vs lexical search",
      "Transformer basics: attention, positional encoding, KV cache",
      "Fine-tuning vs RAG vs prompting — when to use which",
      "Classification metrics: precision, recall, F1, ROC-AUC, confusion matrix",
      "LLM-specific metrics: faithfulness, groundedness, answer relevance",
    ],
  },
  {
    id: "production",
    title: "4. Production and LLMOps",
    body: "Shipping is the differentiator. Companies want engineers who have taken an LLM feature from prototype to on-call rotation. That means observability, cost controls, retries, and a rollback plan.",
    checklist: [
      "Tracing every LLM call with Langfuse, Phoenix, or LangSmith",
      "Prompt and model versioning — treat prompts like code",
      "Guardrails: input validation, output schema, PII redaction, refusal handling",
      "Caching (semantic + exact), batching, and streaming for latency and cost",
      "CI evals that block regressions on a golden set",
      "Rate limits, retries with jittered backoff, circuit breakers",
    ],
  },
  {
    id: "portfolio",
    title: "5. Portfolio Expectations",
    body: "For AI engineer roles, hiring managers weigh a public portfolio heavily — often more than a resume. One deep project that shows end-to-end thinking beats five shallow demos. Publish it, write about it, and be ready to defend every design choice in an interview.",
    checklist: [
      "One RAG project with real documents, evals, and a deployed URL",
      "One agent project using LangGraph or CrewAI with tool use and a state machine",
      "A short case study per project: problem, architecture, metrics, tradeoffs",
      "Public GitHub with clean READMEs, tests, and a Dockerfile",
      "One blog post per project on Medium, Substack, or your own site",
      "Contributions to an open-source LLM tool (bug fix, docs, or integration)",
    ],
  },
  {
    id: "interview",
    title: "6. Common Interview Requirements",
    body: "AI engineer loops usually blend a coding round, an ML systems design round, and a portfolio deep-dive. The systems design round is the one most candidates underprepare for.",
    checklist: [
      "Coding: Python data structures, async, and one systems-language question",
      "System design: design a production RAG service for 10M documents",
      "System design: design a multi-agent workflow with retries and human-in-the-loop",
      "Debugging: given a hallucinated answer, walk through how you would diagnose it",
      "Behavioral: a time you shipped an LLM feature and what broke in production",
      "Portfolio: 20-minute walkthrough of one project, no slides",
    ],
  },
  {
    id: "checklist",
    title: "7. Job Readiness Checklist",
    body: "Use this as a self-assessment before you start applying. If you can honestly check every box, you are ready for mid-level AI engineer roles at product companies. If not, pick the weakest area and ship one project that closes the gap.",
    checklist: [
      "I can build and deploy a RAG service end-to-end",
      "I can wire tracing and evals into an LLM pipeline",
      "I can design an agent workflow with tools, state, and retries",
      "I can explain when to fine-tune vs prompt vs retrieve",
      "I have one deployed project with public metrics",
      "I have written at least one technical post about my work",
      "I have contributed to at least one open-source AI tool",
      "I can whiteboard a production LLM system in 45 minutes",
    ],
  },
];

const AiEngineerJobRequirementsGuide = () => {
  const { lang = "en" } = useParams<{ lang: string }>();

  const path = "/blogs/ai-engineer-job-requirements";
  const pageUrl = langUrl(lang, path);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "AI Engineer Job Requirements: A 2026 Preparation Checklist",
      description:
        "The technical skills, portfolio expectations, and interview requirements for AI engineer roles in 2026 — covering LLMs, RAG, agents, LLMOps, and evaluation.",
      author: { "@id": `${SITE_URL}/#person` },
      datePublished: "2026-07-14",
      dateModified: "2026-07-14",
      inLanguage: lang,
      url: pageUrl,
      mainEntityOfPage: pageUrl,
      image: `${SITE_URL}/og-image.jpg`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      keywords:
        "ai engineer job requirements, ai engineer skills, ai engineer portfolio, applied ai engineer interview, llm engineer requirements, Amulya Varshney",
    },
    breadcrumbJsonLd(lang, [
      { name: "Home", path: "/" },
      { name: "Blogs", path: "/blogs" },
      { name: "AI Engineer Job Requirements", path },
    ]),
  ];

  return (
    <div className="pt-24">
      <Seo
        title="AI Engineer Job Requirements: 2026 Checklist — Amulya Varshney"
        description="Technical skills, portfolio expectations, and interview requirements for AI engineer roles in 2026 — LLMs, RAG, agents, LLMOps, and evaluation."
        path="/blogs/ai-engineer-job-requirements"
        type="article"
        jsonLd={jsonLd}
      />
      <h1 className="sr-only">
        AI Engineer Job Requirements: A 2026 Preparation Checklist
      </h1>
      <Section
        id="ai-engineer-job-requirements"
        eyebrow="Guide · 12 min read"
        title={
          <>
            AI Engineer{" "}
            <span className="gradient-text">Job Requirements</span>
          </>
        }
        subtitle="What hiring managers actually look for in AI engineer candidates in 2026 — skills, portfolio, and interview prep, distilled into a checklist."
      >
        <div className="mb-8">
          <Link
            to={`/${lang}/blogs`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blogs
          </Link>
        </div>

        <HeroBanner label="The 2026 AI engineer profile — a live view of the skills, tools, and interview signals hiring teams score." />

        <article className="glass rounded-2xl p-6 md:p-10 space-y-10 max-w-4xl">
          <p className="text-base leading-relaxed text-muted-foreground">
            AI engineer is one of the fastest-growing roles in software. The
            bar has moved quickly: two years ago a strong Python engineer with
            a couple of LangChain demos could land interviews. Today teams
            expect production LLM experience, working evals, and a deployed
            portfolio. This guide is the checklist I wish I had when I was
            preparing for these interviews — grouped by skill, portfolio, and
            interview loop.
          </p>

          <nav aria-label="Table of contents" className="rounded-xl border border-border/60 p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              On this page
            </p>
            <ol className="space-y-1.5 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-foreground hover:text-primary transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">
                {s.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{s.body}</p>
              {s.id === "core-skills" && <SkillRadar />}
              {s.id === "interview" && <InterviewFunnel />}
              <ul className="space-y-2">
                {s.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="border-t border-border/60 pt-8">
            <h2 className="font-display text-2xl font-semibold mb-3">
              Next step
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Pair this checklist with the{" "}
              <Link
                to={`/${lang}/blogs/applied-ai-engineer-roadmap`}
                className="text-primary hover:underline"
              >
                Applied AI Engineer Roadmap
              </Link>{" "}
              for a stage-by-stage learning path covering LLMOps, RAG, and
              multi-agent systems.
            </p>
          </section>
        </article>
      </Section>
    </div>
  );
};

export default AiEngineerJobRequirementsGuide;
