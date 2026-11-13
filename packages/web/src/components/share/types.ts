import type { Message, Part, Session, AssistantMessage, ToolPart, ToolStateCompleted } from "@opencode-ai/sdk/v2"

export type SharedMessage = Message
export type SharedPart = Part
export type SharedSession = Session
export type SharedAssistant = AssistantMessage
export type SharedToolPart = ToolPart
export type SharedToolStateCompleted = ToolStateCompleted
export type MessageWithParts = Message & { parts: Part[] }

export function text(value: unknown): string {
  return typeof value === "string" ? value : ""
}

export function count(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0
}

export function toolInput(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : { value }
}
