import path from "node:path";
import { fileURLToPath } from "node:url";
import { Embeddings, type EmbeddingsParams } from "@langchain/core/embeddings";
import { env } from "../config/env.js";
import { createLogger } from "../logger.js";

const logger = createLogger("embeddings");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODEL_CACHE_DIR = path.resolve(__dirname, "../../data/models");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FeatureExtractionPipeline = (text: string, opts: Record<string, unknown>) => Promise<any>;

/**
 * Local embedding model, implemented as a LangChain `Embeddings` subclass so it
 * plugs directly into `QdrantVectorStore` and any other LangChain component that
 * expects an `Embeddings` instance — with zero glue code.
 *
 * This is a small first-party class rather than LangChain's own
 * `HuggingFaceTransformersEmbeddings` (previously in `@langchain/community`)
 * because `@langchain/community` is deprecated (see
 * https://github.com/langchain-ai/langchainjs-community/issues/61) and the
 * LangChain project's own guidance is to move off it. The actual inference
 * still runs through the same underlying library — `@huggingface/transformers`
 * (the successor to `@xenova/transformers`) — fully locally, no API key.
 *
 * Default model: Xenova/all-MiniLM-L6-v2 (384 dimensions). Model weights
 * download once on first use into chatbot/data/models and are cached on disk.
 */
export class LocalTransformersEmbeddings extends Embeddings {
  private pipelinePromise: Promise<FeatureExtractionPipeline> | null = null;

  constructor(params: EmbeddingsParams = {}) {
    super(params);
  }

  private async getPipeline(): Promise<FeatureExtractionPipeline> {
    if (!this.pipelinePromise) {
      this.pipelinePromise = (async () => {
        const { pipeline, env: transformersEnv } = await import("@huggingface/transformers");
        transformersEnv.cacheDir = MODEL_CACHE_DIR;
        logger.info(`Loading embedding model "${env.EMBEDDING_MODEL}" (first run downloads weights)...`);
        const extractor = (await pipeline(
          "feature-extraction",
          env.EMBEDDING_MODEL
        )) as unknown as FeatureExtractionPipeline;
        logger.info("Embedding model ready.");
        return extractor;
      })();
    }
    return this.pipelinePromise;
  }

  private async embed(text: string): Promise<number[]> {
    const extractor = await this.getPipeline();
    const output = await extractor(text, { pooling: "mean", normalize: true });
    return Array.from(output.data as Float32Array);
  }

  /** LangChain's `Embeddings` interface method — embeds many documents (sequentially; corpus size doesn't warrant batching). */
  async embedDocuments(documents: string[]): Promise<number[][]> {
    const results: number[][] = [];
    for (const doc of documents) {
      results.push(await this.embed(doc));
    }
    return results;
  }

  /** LangChain's `Embeddings` interface method — embeds a single query string. */
  async embedQuery(document: string): Promise<number[]> {
    return this.embed(document);
  }

  /** Warms the model up at startup so the first real request isn't slowed by the download/load. */
  async warmUp(): Promise<void> {
    await this.getPipeline();
  }
}

export const embeddings = new LocalTransformersEmbeddings();
