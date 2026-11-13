import { expect } from "bun:test"
import { Effect, Layer, Result, Stream } from "effect"
import { sseFraming } from "../src/protocols/shared"
import { testEffect } from "./lib/effect"

const test = testEffect(Layer.empty)

test.effect(
  "SSE framing preserves chunked messages and drops keep-alive markers",
  Effect.gen(function* () {
    const chunks = ["data: hel", "lo\n\ndata: [DONE]\n\ndata: \n\n"]
    const result = yield* sseFraming(Stream.fromIterable(chunks.map((chunk) => new TextEncoder().encode(chunk)))).pipe(
      Stream.runCollect,
    )
    expect(result).toEqual(["hello"])
  }),
)

test.effect(
  "SSE framing rejects oversized unterminated events as typed provider errors",
  Effect.gen(function* () {
    const chunks = Array.from({ length: 11 }, () => new TextEncoder().encode("data: " + "x".repeat(1024 * 1024) + "\n"))
    const result = yield* sseFraming(Stream.fromIterable(chunks)).pipe(Stream.runCollect, Effect.result)
    expect(Result.isFailure(result)).toBe(true)
    if (Result.isFailure(result)) {
      expect(result.failure.module).toBe("ProviderShared")
      expect(result.failure.reason._tag).toBe("InvalidProviderOutput")
    }
  }),
)
