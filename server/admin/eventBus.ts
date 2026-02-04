import { randomUUID } from "crypto";
import type { EventType, Event, InsertEvent } from "@shared/schema";

type EventHandler = (event: Event) => void | Promise<void>;
type EventPayload = Record<string, any>;

interface EventBusConfig {
  logEvents?: boolean;
  persistEvents?: boolean;
}

export class EventBus {
  private subscribers: Map<EventType, Set<EventHandler>> = new Map();
  private eventHistory: Event[] = [];
  private config: EventBusConfig;
  private persistFn?: (event: InsertEvent) => Promise<Event>;

  constructor(config: EventBusConfig = {}) {
    this.config = {
      logEvents: true,
      persistEvents: true,
      ...config,
    };
  }

  setPersistFunction(fn: (event: InsertEvent) => Promise<Event>) {
    this.persistFn = fn;
  }

  subscribe(eventType: EventType, handler: EventHandler): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)!.add(handler);

    return () => {
      this.subscribers.get(eventType)?.delete(handler);
    };
  }

  subscribeMultiple(eventTypes: EventType[], handler: EventHandler): () => void {
    const unsubscribes = eventTypes.map((type) => this.subscribe(type, handler));
    return () => unsubscribes.forEach((unsub) => unsub());
  }

  async publish(
    eventType: EventType,
    payload: EventPayload,
    options: {
      sourceAgent?: string;
      correlationId?: string;
    } = {}
  ): Promise<Event> {
    const eventId = randomUUID();
    const correlationId = options.correlationId || randomUUID();

    const event: Event = {
      id: randomUUID(),
      eventId,
      eventType,
      timestamp: new Date(),
      sourceAgent: options.sourceAgent || null,
      correlationId,
      payload,
      processed: false,
    };

    if (this.config.logEvents) {
      console.log(`[EventBus] ${eventType}`, {
        eventId,
        sourceAgent: options.sourceAgent,
        correlationId,
      });
    }

    if (this.config.persistEvents && this.persistFn) {
      try {
        await this.persistFn({
          eventId,
          eventType,
          sourceAgent: options.sourceAgent || null,
          correlationId,
          payload,
          processed: false,
        });
      } catch (error) {
        console.error("[EventBus] Failed to persist event:", error);
      }
    }

    this.eventHistory.push(event);
    if (this.eventHistory.length > 1000) {
      this.eventHistory = this.eventHistory.slice(-500);
    }

    const handlers = this.subscribers.get(eventType);
    if (handlers) {
      for (const handler of Array.from(handlers)) {
        try {
          await handler(event);
        } catch (error) {
          console.error(`[EventBus] Handler error for ${eventType}:`, error);
          await this.publish("AGENT_ERROR", {
            agent_id: options.sourceAgent || "unknown",
            error_type: "handler_error",
            error_message: error instanceof Error ? error.message : "Unknown error",
            recoverable: true,
          });
        }
      }
    }

    return event;
  }

  getEventHistory(options?: {
    eventType?: EventType;
    sourceAgent?: string;
    correlationId?: string;
    limit?: number;
  }): Event[] {
    let filtered = [...this.eventHistory];

    if (options?.eventType) {
      filtered = filtered.filter((e) => e.eventType === options.eventType);
    }
    if (options?.sourceAgent) {
      filtered = filtered.filter((e) => e.sourceAgent === options.sourceAgent);
    }
    if (options?.correlationId) {
      filtered = filtered.filter((e) => e.correlationId === options.correlationId);
    }

    if (options?.limit) {
      filtered = filtered.slice(-options.limit);
    }

    return filtered;
  }

  getCorrelatedEvents(correlationId: string): Event[] {
    return this.eventHistory.filter((e) => e.correlationId === correlationId);
  }

  clearHistory(): void {
    this.eventHistory = [];
  }
}

export const eventBus = new EventBus();

export function createEventPayload(
  eventType: EventType,
  data: Record<string, any>
): EventPayload {
  return {
    ...data,
    _eventType: eventType,
    _createdAt: new Date().toISOString(),
  };
}
