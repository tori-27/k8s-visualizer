import { ClusterSnapshot, K8sResource } from "../../cluster/cluster.types.js";
import { buildAnalyzePrompt, buildExplainPrompt } from "../promts.js";
import { AiProvider } from "./ai-provider.interface.js";

export class OllamaProvider implements AiProvider {
  readonly name = "ollama";

  constructor(
    private readonly url: string,
    private readonly model: string,
  ) {}

  async explain(resource: K8sResource): Promise<string> {
    return this.generate(buildExplainPrompt(resource));
  }

  async analyzeCluster(snapshot: ClusterSnapshot): Promise<string> {
    return this.generate(buildAnalyzePrompt(snapshot));
  }

  private async generate(prompt: string): Promise<string> {
    const response = await fetch(`${this.url}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = (await response.json()) as { response: string };
    return data.response.trim();
  }
}
