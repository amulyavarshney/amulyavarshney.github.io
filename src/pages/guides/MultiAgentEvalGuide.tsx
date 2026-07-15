import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/portfolio/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbJsonLd, langUrl, SITE_URL } from "@/lib/site";
import {
  HeroBanner,
  EvalPipelineDiagram,
  TrajectoryGraph,
  RubricChart,
  RegressionHeatmap,
  MetricsKPIs,
} from "@/components/guides/Infographics";

const sectionGraphic: Record<string, React.ReactNode> = {
  "why-eval": <TrajectoryGraph />,
  harness: <EvalPipelineDiagram />,
  judges: <RubricChart />,
  regression: <RegressionHeatmap />,
  metrics: <MetricsKPIs />,
};

const sections = [
  {
    id: "why-eval",
    title: "1. Why Multi-Agent Evaluation Is Hard",
    body: "Single-turn LLM evals compare an output to a reference. Multi-agent workflows do not have that luxury: a run is a tree of tool calls, handoffs, and intermediate messages, and two correct runs can look completely different. You need evals that grade the trajectory and the outcome, not just the final string.",
    checklist: [
      "Non-determinism compounds at every hop — one flaky retrieval can derail the whole run",
      "Success is multi-dimensional: correctness, cost, latency, tool efficiency, safety",
      "Traces are the primary artifact; text-only logs are not enough",
      "Regressions hide in the middle of the graph, not at the final answer",
    ],
  },
  {
    id: "harness",
    title: "2. Setting Up the Evaluation Harness",
    body: "Start with a golden dataset of realistic tasks, expected outcomes, and grading rubrics. Run the agent against every case on every change, store the full trace, and score each run with a mix of programmatic checks and judge models. LangGraph exposes the state at each node; Langfuse gives you the trace store and the scoring surface.",
    checklist: [
      "Golden set of 30–100 tasks that cover happy path, edge cases, and known failures",
      "Deterministic seeds where possible (temperature 0, fixed retrieval snapshot)",
      "Structured task schema: input, expected tools, expected outcome, rubric",
      "One command runs the full suite locally and in CI",
      "Every run writes a trace to Langfuse with dataset and version tags",
    ],
  },
  {
    id: "judges",
    title: "3. Judge Models: Rubrics That Hold Up",
    body: "LLM-as-judge works when the rubric is narrow and the reference is strong. Bad rubrics reward verbosity or agree with the model that wrote the answer. Split judgement into small, orthogonal criteria — correctness, grounding, tool use, safety — and score each on a 1–5 or pass/fail scale with concrete anchors.",
    checklist: [
      "Prefer many small rubrics over one omnibus 'is this good' prompt",
      "Anchor each score: what a 1 looks like, what a 5 looks like",
      "Use a different family for judge and generator to reduce self-preference bias",
      "Calibrate judges on a human-labeled slice before trusting them at scale",
      "Log judge reasoning; sample and audit weekly",
    ],
  },
  {
    id: "trajectory",
    title: "4. Grading the Trajectory, Not Just the Answer",
    body: "Multi-agent failures usually happen mid-graph: the router picks the wrong specialist, the tool call has malformed args, a retry loop swallows an error. Score the path itself. LangGraph state snapshots plus Langfuse spans give you a clean surface to write these checks against.",
    checklist: [
      "Tool selection accuracy — did the agent pick the right tool for this task",
      "Tool argument validity — schema-check every call, count failures",
      "Loop and retry counts — flag runs that spin more than expected",
      "Handoff correctness in supervisor / router graphs",
      "Grounding: every factual claim cites a retrieved chunk",
    ],
  },
  {
    id: "regression",
    title: "5. Regression Testing Agentic Loops",
    body: "Prompt and model changes silently break behavior. Treat the golden set like a unit-test suite: run it on every PR, block merges on regressions above a threshold, and diff traces case-by-case so reviewers see exactly what changed. Small numeric noise is fine; a step-function drop is a blocker.",
    checklist: [
      "CI job runs the golden suite on every PR touching prompts, graphs, or tools",
      "Compare to a baseline run, not an absolute score — deltas matter more",
      "Fail the build when accuracy or grounding drops more than a set threshold",
      "Post trace diffs to the PR so reviewers can see the failing cases",
      "Version prompts, graph configs, and tool schemas alongside code",
    ],
  },
  {
    id: "tracing",
    title: "6. Tracing With Langfuse in Production",
    body: "Offline evals catch known failures; tracing catches the unknown ones. Instrument every node, tool call, and LLM invocation. In production, sample traces, run online judges on the sample, and pipe low scores into a review queue that becomes tomorrow's golden set.",
    checklist: [
      "Wrap every LangGraph node and tool with a Langfuse span",
      "Attach cost, latency, and token usage to every span",
      "Session-level tags for user, tenant, model, and prompt version",
      "Online scoring on a sampled slice; alert on score drops",
      "Feedback loop: low-scoring production traces become new golden cases",
    ],
  },
  {
    id: "metrics",
    title: "7. Metrics That Matter",
    body: "Pick a small, defensible dashboard and stick to it. Everything else is noise. These are the ones that consistently predict production quality for multi-agent systems.",
    checklist: [
      "Task success rate on the golden set (primary)",
      "Grounding rate — share of factual claims backed by retrieved context",
      "Tool selection accuracy and tool argument validity",
      "Median and p95 latency per task",
      "Cost per successful task (not per call)",
      "Safety refusal correctness — right refusals up, wrong refusals down",
    ],
  },
  {
    id: "checklist",
    title: "8. Production Readiness Checklist",
    body: "Use this before you promote a multi-agent workflow to real users. If you can honestly check every box, you have an evaluation pipeline you can defend on-call.",
    checklist: [
      "Golden set with 50+ cases covering the top failure modes",
      "Judge rubrics calibrated against human labels",
      "Trajectory checks for tool selection, arguments, and loop counts",
      "CI blocks regressions on accuracy and grounding",
      "Every production run is traced end-to-end in Langfuse",
      "Online scoring on a sampled slice with alerting",
      "A weekly ritual for reviewing low-scoring traces and updating the golden set",
    ],
  },
];

const MultiAgentEvalGuide = () => {
  const { lang = "en" } = useParams<{ lang: string }>();

  const path = "/blogs/multi-agent-eval-guide";
  const pageUrl = langUrl(lang, path);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Building Evaluation Pipelines for Multi-Agent Workflows",
      description:
        "A production guide to evaluating multi-agent AI workflows with LangGraph and Langfuse — judge models, trajectory grading, regression tests, and tracing.",
      author: { "@id": `${SITE_URL}/#person` },
      datePublished: "2026-07-15",
      dateModified: "2026-07-15",
      inLanguage: lang,
      url: pageUrl,
      mainEntityOfPage: pageUrl,
      image: `${SITE_URL}/og-image.jpg`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      keywords:
        "multi-agent evaluation, langgraph evals, langfuse tracing, ai engineer, applied ai, llm judge, agent regression testing, agentic ai evaluation, Amulya Varshney",
    },
    breadcrumbJsonLd(lang, [
      { name: "Home", path: "/" },
      { name: "Blogs", path: "/blogs" },
      { name: "Multi-Agent Evaluation Pipelines", path },
    ]),
  ];

  return (
    <div className="pt-24">
      <Seo
        title="Multi-Agent Evaluation Pipelines: LangGraph + Langfuse Guide"
        description="Build production evaluation pipelines for multi-agent AI workflows using LangGraph and Langfuse — judges, trajectory grading, regression tests, and tracing."
        path="/blogs/multi-agent-eval-guide"
        type="article"
        jsonLd={jsonLd}
      />
      <h1 className="sr-only">
        Building Evaluation Pipelines for Multi-Agent Workflows
      </h1>
      <Section
        id="multi-agent-eval-guide"
        eyebrow="Guide · 14 min read"
        title={
          <>
            Multi-Agent{" "}
            <span className="gradient-text">Evaluation Pipelines</span>
          </>
        }
        subtitle="A production-grade playbook for evaluating multi-agent workflows with LangGraph and Langfuse — judges, trajectories, regression tests, and tracing."
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

        <HeroBanner label="Multi-agent evaluation: an orbital view of tasks, traces, judges, and scores flowing through the loop." />

        <article className="glass rounded-2xl p-6 md:p-10 space-y-10 max-w-4xl">
          <p className="text-base leading-relaxed text-muted-foreground">
            Multi-agent workflows are easy to demo and painful to trust. The
            moment a supervisor routes to the wrong specialist or a tool call
            silently returns an empty result, the whole run derails and the
            final answer still looks plausible. This guide walks through the
            evaluation pipeline I use in production — golden datasets, judge
            models, trajectory grading, CI regression tests, and live tracing
            with LangGraph and Langfuse.
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
              {sectionGraphic[s.id] ?? null}
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
              Related guides
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Pair this with the{" "}
              <Link
                to={`/${lang}/blogs/applied-ai-engineer-roadmap`}
                className="text-primary hover:underline"
              >
                Applied AI Engineer Roadmap
              </Link>{" "}
              for the broader learning path, or the{" "}
              <Link
                to={`/${lang}/blogs/qdrant-fastapi-grpc-guide`}
                className="text-primary hover:underline"
              >
                Qdrant + FastAPI + gRPC guide
              </Link>{" "}
              for the retrieval layer underneath these agents.
            </p>
          </section>
        </article>
      </Section>
    </div>
  );
};

export default MultiAgentEvalGuide;
