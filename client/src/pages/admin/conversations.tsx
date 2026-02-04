import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  User,
  Bot,
  ChevronRight,
  Calendar,
  Clock,
} from "lucide-react";
import type { ExternalConversation } from "@shared/schema";

interface ConversationMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

function MessageBubble({ message }: { message: ConversationMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "" : "flex-row-reverse"}`}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={isUser ? "bg-primary/10" : "bg-green-100 dark:bg-green-900/30"}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div
        className={`rounded-lg px-4 py-2.5 max-w-[80%] ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-1 ${isUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

function ConversationPreview({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: ExternalConversation;
  isSelected: boolean;
  onClick: () => void;
}) {
  const messages = (conversation.messages as ConversationMessage[]) || [];
  const lastMessage = messages[messages.length - 1];
  const preview = lastMessage?.content?.slice(0, 60) || "No messages";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border-b transition-colors hover-elevate ${
        isSelected ? "bg-accent" : ""
      }`}
      data-testid={`conversation-preview-${conversation.id}`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-purple-100 dark:bg-purple-900/30">
            <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm truncate">
              {conversation.title || "Chat Conversation"}
            </span>
            <span className="text-xs text-muted-foreground shrink-0">
              {conversation.createdAt
                ? new Date(conversation.createdAt).toLocaleDateString()
                : ""}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-1">
            {preview}...
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {messages.length} messages
            </Badge>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </button>
  );
}

export default function Conversations() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: conversations, isLoading } = useQuery<ExternalConversation[]>({
    queryKey: ["/api/external/conversations"],
  });

  const selectedConversation = conversations?.find((c) => c.id === selectedId);
  const messages = (selectedConversation?.messages as ConversationMessage[]) || [];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-1 p-6 pb-4">
        <h1 className="text-2xl font-bold" data-testid="text-conversations-title">Conversations</h1>
        <p className="text-muted-foreground">
          View AI chat conversations from website visitors
        </p>
      </div>

      <div className="flex-1 flex gap-6 px-6 pb-6 min-h-0">
        <Card className="w-[400px] flex flex-col shrink-0">
          <CardHeader className="py-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">All Conversations</CardTitle>
              <Badge variant="secondary">{conversations?.length || 0}</Badge>
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : conversations && conversations.length > 0 ? (
              <div>
                {conversations.map((conv) => (
                  <ConversationPreview
                    key={conv.id}
                    conversation={conv}
                    isSelected={conv.id === selectedId}
                    onClick={() => setSelectedId(conv.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No conversations yet. Sync with external CRM to view chat history.
                </p>
              </div>
            )}
          </ScrollArea>
        </Card>

        <Card className="flex-1 flex flex-col min-w-0">
          {selectedConversation ? (
            <>
              <CardHeader className="py-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {selectedConversation.title || "Chat Conversation"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {selectedConversation.createdAt
                          ? new Date(selectedConversation.createdAt).toLocaleDateString()
                          : "Unknown date"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {messages.length} messages
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Choose a conversation from the list to view the full chat history
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
