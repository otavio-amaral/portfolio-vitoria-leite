import { describe, expect, it } from "vitest";
import { formatWhatsAppLink, getEmbeddableVideoUrl, isEmbeddableVideoUrl } from "@/lib/utils";

describe("video embeds", () => {
  it("aceita apenas embeds HTTPS de hosts permitidos", () => {
    expect(getEmbeddableVideoUrl("https://www.youtube.com/embed/abc123")).toBe(
      "https://www.youtube.com/embed/abc123"
    );
    expect(getEmbeddableVideoUrl("https://player.vimeo.com/video/123")).toBe(
      "https://player.vimeo.com/video/123"
    );
  });

  it("rejeita URLs parecidas, inseguras ou fora da allowlist", () => {
    expect(isEmbeddableVideoUrl("https://youtube.com.evil.test/embed/abc")).toBe(false);
    expect(isEmbeddableVideoUrl("http://www.youtube.com/embed/abc")).toBe(false);
    expect(isEmbeddableVideoUrl("https://www.youtube.com/watch?v=abc")).toBe(false);
    expect(isEmbeddableVideoUrl("javascript:alert(1)")).toBe(false);
  });
});

it("normaliza o telefone para o link do WhatsApp", () => {
  expect(formatWhatsAppLink("+55 (11) 98336-6510")).toBe("https://wa.me/5511983366510");
});
