import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/portfolio/Section";
import { Seo } from "@/components/Seo";
import { HeroBanner, QdrantArchDiagram, LatencyComparison } from "@/components/guides/Infographics";

const sections = [
  {
    id: "why-grpc",
    title: "1. Why gRPC for Qdrant in Production",
    body: "Qdrant exposes both REST and gRPC. For high-QPS vector search from a FastAPI service, gRPC is meaningfully faster: HTTP/2 multiplexing, protobuf binary payloads, persistent connections, and no per-request JSON serialization of large float vectors. For a 1024-dim embedding, gRPC payloads are typically 3–5x smaller and 20–40% lower p95 latency than REST under load.",
    checklist: [
      "Use gRPC for hot-path retrieval (search, upsert, recommend)",
      "Keep REST for admin and one-off tooling — easier to curl",
      "Enable HTTP/2 keep-alive; avoid re-handshaking on every call",
      "Prefer named vectors + payload indexes over post-filtering",
    ],
  },
  {
    id: "singleton-client",
    title: "2. The Singleton Client Pattern",
    body: "The most common Qdrant + FastAPI bug is creating a fresh QdrantClient per request. That opens a new gRPC channel each time, breaks connection pooling, and quickly exhausts sockets under load. Instantiate one AsyncQdrantClient at app startup, store it on app.state, and inject it into routes via FastAPI Depends.",
    checklist: [
      "One AsyncQdrantClient per process, created in lifespan startup",
      "Close it cleanly in lifespan shutdown to flush the gRPC channel",
      "Inject via Depends — never import a module-level global",
      "For multi-worker uvicorn, each worker gets its own client (expected)",
    ],
  },
  {
    id: "fastapi-lifespan",
    title: "3. FastAPI Lifespan Wiring",
    body: "Use the modern lifespan context manager (not the deprecated @app.on_event hooks) to own the Qdrant client's lifecycle. This guarantees the gRPC channel is up before the first request and torn down cleanly on SIGTERM — important for graceful pod shutdown in Kubernetes.",
    checklist: [
      "Async lifespan context manager on the FastAPI app",
      "prefer_grpc=True and grpc_port=6334 on AsyncQdrantClient",
      "Health check that pings client.get_collections() with a timeout",
      "Readiness probe returns 503 until the first successful ping",
    ],
  },
  {
    id: "collections-schema",
    title: "4. Collections, Named Vectors, and Payload Indexes",
    body: "Design the collection once and version the schema. Use named vectors when you need multiple embedding models (e.g., dense + sparse for hybrid search). Add payload indexes for every field you filter on — unindexed filters trigger full scans and destroy p99 latency.",
    checklist: [
      "recreate_collection only in migrations, never at request time",
      "Named vectors: 'dense' (BGE/E5) + 'sparse' (SPLADE) for hybrid",
      "Payload indexes on tenant_id, doc_type, created_at",
      "HNSW params: m=16, ef_construct=128 as a solid default",
      "Quantization (scalar or binary) for >10M vectors to cut RAM",
    ],
  },
  {
    id: "async-search",
    title: "5. Async Search, Batching, and Backpressure",
    body: "AsyncQdrantClient plays well with FastAPI's event loop, but you still need to guard against thundering herds. Batch upserts, cap in-flight searches per request with a semaphore, and set explicit timeouts on every gRPC call so a slow Qdrant node cannot stall your workers.",
    checklist: [
      "Batch upserts in chunks of 256–1024 points",
      "asyncio.Semaphore around fan-out searches (e.g., multi-query RAG)",
      "Explicit timeout= on search/upsert; never rely on defaults",
      "Retry with jittered backoff on UNAVAILABLE and DEADLINE_EXCEEDED only",
    ],
  },
  {
    id: "observability",
    title: "6. Tracing, Metrics, and Cost Control",
    body: "Wrap every Qdrant call in an OpenTelemetry span, tag it with collection, vector name, and top_k, and export to your tracer of choice (Langfuse, Phoenix, Jaeger). Track vector count, RAM per collection, and search p50/p95/p99 as first-class SLOs — retrieval is usually the slowest step in a RAG pipeline.",
    checklist: [
      "OTel spans: qdrant.search, qdrant.upsert, qdrant.scroll",
      "Prometheus metrics: search latency histogram per collection",
      "Alert on p95 > 250ms or error rate > 0.5%",
      "Snapshot collections nightly; test restore quarterly",
    ],
  },
  {
    id: "deploy",
    title: "7. Deploying Qdrant + FastAPI",
    body: "Run Qdrant as a StatefulSet with a PersistentVolume, expose ports 6333 (REST) and 6334 (gRPC), and put your FastAPI service in the same cluster and namespace so gRPC traffic stays on the pod network. For multi-tenant SaaS, use a single collection with tenant_id in the payload — one collection per tenant does not scale past a few hundred tenants.",
    checklist: [
      "Qdrant StatefulSet with anti-affinity across nodes",
      "gRPC service on ClusterIP; do not expose 6334 publicly",
      "Resource requests: 2 vCPU, 4Gi RAM per 1M vectors as a floor",
      "FastAPI behind an ingress with HTTP/2 enabled end-to-end",
      "Sealed API key stored in a Secret, mounted as env var",
    ],
  },
];

const codeSetup = `# pyproject.toml (excerpt)
# qdrant-client[fastembed]>=1.11
# fastapi>=0.115
# uvicorn[standard]>=0.30

from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, Request
from qdrant_client import AsyncQdrantClient

@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncQdrantClient(
        host="qdrant",
        grpc_port=6334,
        prefer_grpc=True,
        timeout=5.0,
    )
    # Warm the channel + fail fast on misconfig.
    await client.get_collections()
    app.state.qdrant = client
    try:
        yield
    finally:
        await client.close()

app = FastAPI(lifespan=lifespan)

def get_qdrant(request: Request) -> AsyncQdrantClient:
    return request.app.state.qdrant`;

const codeSearch = `from qdrant_client.http import models as qm

@app.post("/search")
async def search(
    query_vec: list[float],
    tenant_id: str,
    top_k: int = 8,
    qdrant: AsyncQdrantClient = Depends(get_qdrant),
):
    hits = await qdrant.search(
        collection_name="documents",
        query_vector=("dense", query_vec),
        query_filter=qm.Filter(
            must=[qm.FieldCondition(
                key="tenant_id",
                match=qm.MatchValue(value=tenant_id),
            )],
        ),
        limit=top_k,
        with_payload=True,
        timeout=2.0,
    )
    return [{"id": h.id, "score": h.score, "payload": h.payload} for h in hits]`;

const QdrantFastapiGrpcGuide = () => {
  const { lang = "en" } = useParams<{ lang: string }>();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Qdrant + FastAPI + gRPC: A Production Guide with the Singleton Client Pattern",
      description:
        "A practical guide to deploying Qdrant with gRPC and FastAPI: singleton AsyncQdrantClient, lifespan wiring, named vectors, hybrid search, tracing, and Kubernetes deployment.",
      author: { "@type": "Person", name: "Amulya Varshney" },
      datePublished: "2026-07-14",
      dateModified: "2026-07-14",
      inLanguage: lang,
      mainEntityOfPage: `/${lang}/blogs/qdrant-fastapi-grpc-guide`,
      keywords:
        "qdrant grpc client, qdrant fastapi, async qdrant client, vector database production, llmops rag, singleton client pattern",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `/${lang}` },
        { "@type": "ListItem", position: 2, name: "Blogs", item: `/${lang}/blogs` },
        {
          "@type": "ListItem",
          position: 3,
          name: "Qdrant + FastAPI + gRPC Guide",
          item: `/${lang}/blogs/qdrant-fastapi-grpc-guide`,
        },
      ],
    },
  ];

  return (
    <div className="pt-24">
      <Seo
        title="Qdrant + FastAPI + gRPC: Production Guide — Amulya Varshney"
        description="Deploy Qdrant with gRPC and FastAPI using the singleton AsyncQdrantClient pattern: lifespan wiring, named vectors, hybrid search, tracing, and Kubernetes deployment."
        path="/blogs/qdrant-fastapi-grpc-guide"
        type="article"
        jsonLd={jsonLd}
      />
      <h1 className="sr-only">
        Qdrant + FastAPI + gRPC: A Production Guide with the Singleton Client Pattern
      </h1>
      <Section
        id="qdrant-guide"
        eyebrow="Guide · 14 min read"
        title={
          <>
            Qdrant + FastAPI +{" "}
            <span className="gradient-text">gRPC</span>
          </>
        }
        subtitle="A production-ready pattern for wiring an AsyncQdrantClient into FastAPI over gRPC — the exact setup I use for RAG and vector-search services in real deployments."
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

        <HeroBanner label="Qdrant + FastAPI + gRPC — a singleton client, warm channels, and observability from day one." />

        <article className="glass rounded-2xl p-6 md:p-10 space-y-10 max-w-4xl">
          <QdrantArchDiagram />
          <p className="text-base leading-relaxed text-muted-foreground">
            Qdrant is a fast, open-source vector database that shines in
            production RAG stacks — but only when you wire it up correctly.
            Most of the pain I see in code reviews comes from three mistakes:
            using REST on the hot path, creating a new client per request,
            and skipping payload indexes. This guide walks through the setup
            I actually ship: a singleton AsyncQdrantClient over gRPC, owned
            by FastAPI's lifespan, with hybrid search and observability from
            day one.
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
              {s.id === "why-grpc" && <LatencyComparison />}
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
              Reference: singleton client + lifespan
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              The full pattern in ~30 lines. Copy this into your FastAPI app
              and every route gets the same warmed-up gRPC channel via
              Depends.
            </p>
            <pre className="text-xs bg-muted/60 rounded-xl p-4 overflow-x-auto border border-border/60">
              <code>{codeSetup}</code>
            </pre>
          </section>

          <section className="border-t border-border/60 pt-8">
            <h2 className="font-display text-2xl font-semibold mb-3">
              Reference: filtered search endpoint
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              A tenant-scoped vector search with an explicit timeout and
              named-vector selection. Note the payload filter uses an indexed
              field — never filter on unindexed keys in the hot path.
            </p>
            <pre className="text-xs bg-muted/60 rounded-xl p-4 overflow-x-auto border border-border/60">
              <code>{codeSearch}</code>
            </pre>
          </section>

          <section className="border-t border-border/60 pt-8">
            <h2 className="font-display text-2xl font-semibold mb-3">
              What to skip
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Skip per-tenant collections, synchronous QdrantClient in async
              routes, and REST on the search path. Skip re-embedding the whole
              corpus every deploy — version your embeddings and re-embed only
              on model change.
            </p>
          </section>
        </article>
      </Section>
    </div>
  );
};

export default QdrantFastapiGrpcGuide;
