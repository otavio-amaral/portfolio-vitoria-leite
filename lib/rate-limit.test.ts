import { describe, expect, it } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("limita cada IP e expõe os cabeçalhos de quota", () => {
    const request = new Request("https://portfolio.test/api", {
      headers: { "x-forwarded-for": "203.0.113.10, 10.0.0.1" }
    });
    const namespace = `test-${crypto.randomUUID()}`;

    expect(checkRateLimit(request, namespace, 2).allowed).toBe(true);
    const second = checkRateLimit(request, namespace, 2);
    const third = checkRateLimit(request, namespace, 2);

    expect(second.headers["RateLimit-Remaining"]).toBe("0");
    expect(third.allowed).toBe(false);
  });

  it("mantém quotas separadas por IP", () => {
    const namespace = `test-${crypto.randomUUID()}`;
    const first = new Request("https://portfolio.test/api", { headers: { "x-real-ip": "203.0.113.11" } });
    const second = new Request("https://portfolio.test/api", { headers: { "x-real-ip": "203.0.113.12" } });

    checkRateLimit(first, namespace, 1);
    expect(checkRateLimit(first, namespace, 1).allowed).toBe(false);
    expect(checkRateLimit(second, namespace, 1).allowed).toBe(true);
  });
});
