import { AiProvider } from "./providers/ai-provider.interface.js";
import { OllamaProvider } from "./providers/ollama.provider.js";
import { OpenAiProvider } from "./providers/openai.provider.js";
import { ClusterSnapshot, K8sResource } from "../cluster/cluster.types.js";

export class AiService {
  private readonly provider: AiProvider;

  constructor() {
    this.provider = AiService.createProvider();
  }

  private static createProvider(): AiProvider {
    const providerName = process.env.AI_PROVIDER ?? "ollama";

    switch (providerName) {
      case "openai": {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY env variable is required");

        return new OpenAiProvider(
          apiKey,
          process.env.AI_MODEL ?? "gpt-4o-mini",
        );
      }
      case "ollama":
        return new OllamaProvider(
          process.env.OLLAMA_URL ?? "http://localhost:11434",
          process.env.AI_MODEL ?? "llama3.2",
        );

      default:
        throw new Error(`Unknown AI provider: ${providerName}`);
    }
  }

  get providerName(): string {
    return this.provider.name;
  }

  explain(resource: K8sResource): Promise<string> {
    return this.provider.explain(resource);
  }

  analyzeCluster(snapshot: ClusterSnapshot): Promise<string> {
    return this.provider.analyzeCluster(snapshot);
  }
}
