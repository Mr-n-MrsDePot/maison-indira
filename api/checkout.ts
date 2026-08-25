import type { IncomingMessage, ServerResponse } from "node:http";
import { loadLocalEnv, stripeSecret } from "../server/env.ts";
import { createCheckoutSession, parseCartBody, requestOrigin } from "../server/stripe.ts";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  loadLocalEnv();
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "POST only" }));
    return;
  }
  try {
    const raw = await readBody(req);
    const payload = raw ? (JSON.parse(raw) as unknown) : {};
    const host = typeof req.headers.host === "string" ? req.headers.host : "localhost:5222";
    const proto =
      typeof req.headers["x-forwarded-proto"] === "string"
        ? req.headers["x-forwarded-proto"]
        : "https";
    const result = await createCheckoutSession({
      secret: stripeSecret(),
      origin: requestOrigin({
        host,
        "x-forwarded-proto": proto,
        "x-forwarded-host":
          typeof req.headers["x-forwarded-host"] === "string"
            ? req.headers["x-forwarded-host"]
            : undefined,
      }),
      lines: parseCartBody(payload),
    });
    if ("url" in result) {
      res.statusCode = 200;
      res.end(JSON.stringify({ url: result.url }));
      return;
    }
    res.statusCode = result.status;
    res.end(JSON.stringify({ error: result.error }));
  } catch (err) {
    res.statusCode = 500;
    const message = err instanceof Error ? err.message : "Checkout failed";
    res.end(JSON.stringify({ error: message }));
  }
}
