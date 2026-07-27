import http from "node:http";
import { FactoryServiceEdgeCore } from "./core.js";

function collectBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

export function createFactoryServiceEdgeHandler(core = new FactoryServiceEdgeCore()) {
  return async function handleNodeRequest(req, res) {
    try {
      const bodyText = await collectBody(req);
      const response = await core.handle({
        method: req.method,
        url: req.url,
        headers: req.headers,
        bodyText,
        remoteAddress: req.socket?.remoteAddress ?? "unknown",
      });
      res.statusCode = response.statusCode;
      for (const [key, value] of Object.entries(response.headers)) {
        res.setHeader(key, value);
      }
      res.end(response.body);
    } catch {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json; charset=utf-8");
      res.end(
        JSON.stringify(
          {
            apiVersion: "1.0.0",
            error: {
              code: "INTERNAL_ERROR",
              message: "Unhandled transport failure",
              correlationId: "transport-failure",
            },
          },
          null,
          2
        )
      );
    }
  };
}

export function startFactoryServiceEdgeHttpServer(options = {}) {
  const core = options.core ?? new FactoryServiceEdgeCore(options);
  const handler = createFactoryServiceEdgeHandler(core);
  const server = http.createServer((req, res) => {
    void handler(req, res);
  });
  return server;
}
