import { FastifyInstance } from "fastify";
import { AiService } from "./ai.service.js";
import { K8sResource } from "../cluster/cluster.types.js";

declare module "fastify" {
  interface FastifyInstance {
    aiService: AiService;
  }
}

export async function aiRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: { resource: K8sResource } }>(
    "/explain",
    async (request, reply) => {
      const { resource } = request.body;

      if (!resource) {
        return reply
          .code(400)
          .send({ ok: false, error: "resource is required" });
      }

      const explanation = await fastify.aiService.explain(resource);
      return { ok: true, explanation };
    },
  );

  fastify.post("/analyze", async (request, reply) => {
    if (!fastify.clusterService.isConnected()) {
      return reply.code(503).send({ error: "No cluster connected" });
    }

    const snapshot = await fastify.clusterService.getSnapshot();
    const analysis = await fastify.aiService.analyzeCluster(snapshot);
    return { ok: true, analysis };
  });

  fastify.get("/status", async () => ({
    provider: fastify.aiService.providerName,
    model: process.env.AI_MODEL ?? "llama3.2",
  }));
}
