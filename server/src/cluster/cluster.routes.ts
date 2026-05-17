import { FastifyInstance } from "fastify";
import "@fastify/multipart";
import { ClusterService } from "./cluster.service.js";

declare module "fastify" {
  interface FastifyInstance {
    clusterService: ClusterService;
  }
}

export async function clusterRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post("/connect", async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.code(400).send({ ok: false, error: "No file provided" });
    }

    const buffer = await data.toBuffer();
    const kubeconfigContent = buffer.toString("utf-8");

    try {
      fastify.clusterService.connectFromFile(kubeconfigContent);
      const info = fastify.clusterService.getClusterInfo();

      return {
        ok: true,
        clusterName: info?.name ?? "unknown",
        server: info?.server ?? "unknown",
      };
    } catch (err: any) {
      return reply.code(400).send({ ok: false, error: err.message });
    }
  });

  fastify.delete("/disconnect", async (request, reply) => {
    if (!fastify.clusterService.isConnected()) {
      return reply.code(400).send({ ok: false, error: "Not connected" });
    }

    fastify.clusterService.disconnect();
    return { ok: true };
  });

  fastify.get("/status", async (_request, _reply) => {
    const connected = fastify.clusterService.isConnected();
    const info = fastify.clusterService.getClusterInfo();

    return {
      connected,
      clusterName: info?.name ?? null,
      server: info?.server ?? null,
    };
  });
}
