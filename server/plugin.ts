import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { loadLocalEnv, stripePublishable, stripeSecret } from "./env.ts";
import { createCheckoutSession, parseCartBody, requestOrigin } from "./stripe.ts";

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

export function checkoutPlugin(): Plugin {
  return {
    name: "maison-indira-checkout",
    configureServer(server) {
      loadLocalEnv();
      server.middlewares.use("/api/checkout", (req, res, next) => {
        void (async () => {
          if (req.method === "OPTIONS") {
            res.statusCode = 204;
            res.end();
            return;
          }
          if (req.method !== "POST") {
            send(res, 405, { error: "POST only" });
            return;
          }
          try {
            const payload = await readJson(req);
            const host = typeof req.headers.host === "string" ? req.headers.host : "localhost:5222";
            const proto =
              typeof req.headers["x-forwarded-proto"] === "string"
                ? req.headers["x-forwarded-proto"]
                : "http";
            const result = await createCheckoutSession({
              secret: stripeSecret(),
              publishableKey: stripePublishable(),
              origin: requestOrigin({
                host,
                "x-forwarded-proto": proto,
              }),
              lines: parseCartBody(payload),
            });
            if ("clientSecret" in result) send(res, 200, result);
            else send(res, result.status, { error: result.error });
          } catch (err) {
            const message = err instanceof Error ? err.message : "Checkout failed";
            send(res, 500, { error: message });
          }
        })().catch(next);
      });
    },
  };
}
