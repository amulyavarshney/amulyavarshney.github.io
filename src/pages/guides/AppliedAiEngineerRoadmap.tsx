import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/portfolio/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbJsonLd, langUrl, SITE_URL } from "@/lib/site";
import { HeroBanner, SkillRadar } from "@/components/guides/Infographics";

const sections = [
  {
    id: "foundations",
    title: "1. Foundations: Python, Math, and ML Basics",
    body: "Start with strong Python fundamentals, then add linear algebra, probability, and gradient-based optimization. Learn how supervised, unsupervised, and reinforcement learning differ, and build a few small models with scikit-learn to internalize the training loop.",
    checklist: [
      "Python 3.11+, typing, async, and packaging (uv or poetry)",
      "NumPy, pandas, scikit-learn",
      "Loss functions, gradient descent, regularization",
      "Model evaluation: precision, recall, ROC-AUC, calibration",
    ],
  },
  {
    id: "deep-learning",
    title: "2. Deep Learning and Transformers",
    body: "Understand how transformers actually work — attention, positional encodings, tokenization, and the training/inference split. You do not need to train a foundation model, but you must be able to reason about latency, context windows, quantization, and cost.",
    checklist: [
      "PyTorch fundamentals: tensors, autograd, nn.Module",
      "Attention, KV-cache, RoPE, and long-context tradeoffs",
      "Fine-tuning: LoRA, QLoRA, PEFT",
      "Quantization: GPTQ, AWQ, GGUF, and when INT8/INT4 is safe",
    ],
  },
  {
    id: "llmops",
    title: "3. LLMOps: Prompts, Evals, and Observability",
    body: "Applied AI engineers ship reliable systems, not demos. That means prompt versioning, deterministic evals, tracing every call, and building regression suites that catch silent quality drops when a model or prompt changes.",
    checklist: [
      "Prompt templates and versioning (Jinja, Guidance, DSPy)",
      "Structured output: JSON mode, function calling, Pydantic validation",
      "Evals: LLM-as-judge, rubric scoring, golden datasets",
      "Tracing with OpenTelemetry, LangSmith, Langfuse, or Phoenix",
      "Cost, latency, and token-budget dashboards",
    ],
  },
  {
    id: "rag",
    title: "4. RAG Pipelines That Actually Retrieve",
    body: "Naive RAG fails on real corpora. Learn chunking strategies, hybrid search, reranking, and query rewriting. Measure retrieval quality separately from generation quality — most RAG bugs live in retrieval, not the LLM.",
    checklist: [
      "Chunking: semantic, recursive, layout-aware, late-chunking",
      "Embeddings: BGE, E5, OpenAI, Voyage — pick per domain",
      "Vector stores: pgvector, Qdrant, Weaviate, LanceDB",
      "Hybrid search (BM25 + dense) and cross-encoder rerankers",
      "Query transforms: HyDE, multi-query, step-back prompting",
      "Retrieval evals: recall@k, MRR, nDCG",
    ],
  },
  {
    id: "agents",
    title: "5. Multi-Agent Systems and Tool Use",
    body: "Move from single-shot prompts to agents that plan, call tools, and recover from failure. Design for observability and guardrails from day one — an unmonitored agent loop is a bill waiting to happen.",
    checklist: [
      "Frameworks: LangGraph, CrewAI, AutoGen, OpenAI Agents SDK",
      "Tool schemas, retries, and idempotency",
      "Planner/executor and supervisor/worker patterns",
      "Memory: short-term scratchpad, long-term episodic, semantic",
      "Guardrails: input/output validation, allowlists, budget caps",
    ],
  },
  {
    id: "production",
    title: "6. Production, Security, and Scaling",
    body: "Deploy behind a gateway, cache aggressively, and treat every user input as untrusted. Prompt injection, data exfiltration, and PII leaks are the top real-world incidents — design for them.",
    checklist: [
      "Serving: vLLM, TGI, Ollama, Bedrock, Vertex, Azure OpenAI",
      "Streaming, SSE, and backpressure",
      "Semantic caching and response caching",
      "Prompt-injection defenses and output sanitization",
      "PII redaction, audit logs, and per-tenant rate limits",
    ],
  },
  {
    id: "portfolio",
    title: "7. Build a Portfolio That Proves It",
    body: "Ship three end-to-end projects: a RAG system on a real corpus with evals, a multi-agent workflow that automates a real task, and a fine-tuned small model deployed behind an API. Write about each with numbers — latency, cost per request, eval scores.",
    checklist: [
      "RAG over your own docs with recall@k reported",
      "LangGraph agent that files PRs, drafts emails, or triages tickets",
      "Fine-tuned 7B model on a niche task, benchmarked vs GPT-4o-mini",
      "One blog post per project with metrics and tradeoffs",
    ],
  },
];

const AppliedAiEngineerRoadmap = () => {
  const { lang = "en" } = useParams<{ lang: string }>();

  const path = "/blogs/applied-ai-engineer-roadmap";
  const pageUrl = langUrl(lang, path);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "The Applied AI Engineer Roadmap: Skills and Tools for 2026",
      description:
        "A step-by-step learning path for becoming an Applied AI Engineer — covering Python, transformers, LLMOps, RAG pipelines, multi-agent systems, and production deployment.",
      author: { "@id": `${SITE_URL}/#person` },
      datePublished: "2026-07-14",
      dateModified: "2026-07-14",
      inLanguage: lang,
      url: pageUrl,
      mainEntityOfPage: pageUrl,
      image: `${SITE_URL}/og-image.jpg`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      keywords:
        "ai engineer, applied ai, llmops, rag pipelines, multi-agent systems, ai engineer roadmap, Amulya Varshney",
    },
    breadcrumbJsonLd(lang, [
      { name: "Home", path: "/" },
      { name: "Blogs", path: "/blogs" },
      { name: "Applied AI Engineer Roadmap", path },
    ]),
  ];

  return (
    <div className="pt-24">
      <Seo
        title="The Applied AI Engineer Roadmap (2026) — Amulya Varshney"
        description="A practical, step-by-step roadmap to become an Applied AI Engineer: Python, transformers, LLMOps, RAG pipelines, multi-agent systems, and production deployment."
        path="/blogs/applied-ai-engineer-roadmap"
        type="article"
        jsonLd={jsonLd}
      />
      <h1 className="sr-only">
        The Applied AI Engineer Roadmap: Skills and Tools for 2026
      </h1>
      <Section
        id="roadmap"
        eyebrow="Guide · 12 min read"
        title={
          <>
            The Applied AI Engineer{" "}
            <span className="gradient-text">Roadmap</span>
          </>
        }
        subtitle="A seven-stage learning path from Python fundamentals to production-grade multi-agent systems — the exact skills and tools hiring managers ask about in 2026."
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

        <HeroBanner label="The seven stages of the Applied AI Engineer path — from foundations to a shipped portfolio." />

        <article className="glass rounded-2xl p-6 md:p-10 space-y-10 max-w-4xl">
          <p className="text-base leading-relaxed text-muted-foreground">
            "AI Engineer" now means something specific: someone who builds
            reliable systems on top of foundation models. It is not the same as
            an ML researcher, and it is not the same as a data scientist. This
            roadmap is the path I recommend to engineers moving into applied AI
            in 2026 — no fluff, just the skills that show up in real job specs
            and real incident reviews.
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
                {s.id === "foundations" && <SkillRadar />}
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
              How long does it take?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              For a working software engineer: three to six months of focused
              part-time study to be productive, twelve months to be strong. The
              fastest accelerant is shipping — pick one real problem, build the
              full loop (retrieval, generation, eval, deploy), and iterate in
              public.
            </p>
          </section>

          <section className="border-t border-border/60 pt-8">
            <h2 className="font-display text-2xl font-semibold mb-3">
              What to skip
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Skip pre-training from scratch, exotic architectures, and the
              framework-of-the-week. Depth in one agent framework, one vector
              store, and one eval stack beats shallow familiarity with all of
              them.
            </p>
          </section>
        </article>
      </Section>
    </div>
  );
};

export default AppliedAiEngineerRoadmap;
