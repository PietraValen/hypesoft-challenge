import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deve retornar o valor inicial imediatamente", () => {
    const { result } = renderHook(() => useDebounce("test", 300));
    expect(result.current).toBe("test");
  });

  it("deve atualizar o valor após o delay", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 300 },
      }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 300 });
    expect(result.current).toBe("initial"); // Ainda não atualizou

    vi.advanceTimersByTime(300);
    await waitFor(() => {
      expect(result.current).toBe("updated");
    });
  });

  it("deve cancelar atualizações anteriores quando o valor muda rapidamente", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: "first" },
      }
    );

    rerender({ value: "second" });
    vi.advanceTimersByTime(150);

    rerender({ value: "third" });
    vi.advanceTimersByTime(150);

    // Ainda não deve ter atualizado
    expect(result.current).toBe("first");

    vi.advanceTimersByTime(150);
    await waitFor(() => {
      expect(result.current).toBe("third");
    });
  });

  it("deve funcionar com números", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 0 },
      }
    );

    rerender({ value: 100 });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current).toBe(100);
    });
  });

  it("deve usar delay customizado", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "test", delay: 500 },
      }
    );

    rerender({ value: "updated", delay: 500 });
    vi.advanceTimersByTime(300);
    expect(result.current).toBe("test"); // Ainda não atualizou

    vi.advanceTimersByTime(200);
    await waitFor(() => {
      expect(result.current).toBe("updated");
    });
  });
});
