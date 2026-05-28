import { AiProvider } from "./ai-provider.interface.js";
import { ClusterSnapshot, K8sResource } from "../../cluster/cluster.types.js";
import { buildAnalyzePrompt, buildExplainPrompt } from "../promts.js";

export class OpenAiProvider implements AiProvider {
  readonly name = "openai";

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async explain(resource: K8sResource): Promise<string> {
    return this.complete(buildExplainPrompt(resource));
  }

  async analyzeCluster(snapshot: ClusterSnapshot): Promise<string> {
    return this.complete(buildAnalyzePrompt(snapshot));
  }

  private async complete(prompt: string): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };

    return data.choices[0].message.content.trim();
  }
}
