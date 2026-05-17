import Fastify, { type FastifyError } from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import websocket from "@fastify/websocket";
import { ClusterService } from "./cluster/cluster.service.js";
import { clusterRoutes } from "./cluster/cluster.routes.js";
import { WsGateway } from "./gateway/ws.gateway.js";
import { AppError, AppErrorCode } from "./errors.js";

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: ["http://localhost:5173", "http://localhost:3001"],
});
await fastify.register(multipart);
await fastify.register(websocket);

const clusterService = new ClusterService();
const wsGateway = new WsGateway(clusterService);

fastify.decorate("clusterService", clusterService);

fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      ok: false,
      code: error.code,
      error: error.message,
    });
  }

  // K8s API errors
  if (error instanceof Error && error.message.includes("ECONNREFUSED")) {
    return reply.code(503).send({
      ok: false,
      code: AppErrorCode.CLUSTER_NOT_CONNECTED,
      error: "Cannot reach K8s API server",
    });
  }

  // unknown error
  fastify.log.error(error);
  reply.code(500).send({
    ok: false,
    code: "INTERNAL_ERROR",
    error: "Something went wrong",
  });
});

await fastify.register(clusterRoutes, { prefix: "/api/cluster" });

fastify.get("/ws", { websocket: true }, (socket) => {
  wsGateway.handleConnection(socket);
});

await fastify.listen({ port: 3001, host: "0.0.0.0" });

export default fastify;
