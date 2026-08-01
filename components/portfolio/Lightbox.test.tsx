import { useState, type JSX } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Lightbox } from "@/components/portfolio/Lightbox";
import type { MediaItem } from "@/types/portfolio";

const item: MediaItem = {
  id: "photo-1",
  name: "Retrato editorial",
  mediaType: "image",
  thumbnailUrl: "/thumb.jpg",
  fullUrl: "/photo.jpg",
  category: "fotografia"
};

function Fixture(): JSX.Element {
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);

  return (
    <div>
      <button type="button" onClick={() => setActiveItem(item)}>Abrir foto</button>
      <Lightbox item={activeItem} onClose={() => setActiveItem(null)} />
    </div>
  );
}

describe("Lightbox", () => {
  it("move o foco para o diálogo, fecha com Escape e devolve o foco", async () => {
    render(<Fixture />);
    const trigger = screen.getByRole("button", { name: "Abrir foto" });

    trigger.focus();
    fireEvent.click(trigger);

    const closeButton = await screen.findByRole("button", { name: /fechar/i });
    await waitFor(() => expect(closeButton).toHaveFocus());
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});
