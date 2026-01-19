import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles, X, MessageCircle, ArrowRight, TrendingUp, AlertTriangle, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface QuickOption {
  label: string;
  value: string;
  icon: typeof TrendingUp;
}

interface AuditChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_OPTIONS: QuickOption[] = [
  { label: "I need more local leads", value: "I need more local leads for my Hawaii business", icon: TrendingUp },
  { label: "My website looks outdated", value: "My website looks outdated and doesn't reflect my business quality", icon: Globe },
  { label: "I'm losing customers to competitors", value: "I feel like I'm losing customers to my competitors online", icon: AlertTriangle },
  { label: "I want to grow but don't know how", value: "I want to grow my business but I'm not sure where to start with digital", icon: Users },
];

const PROBLEM_OPTIONS: QuickOption[] = [
  { label: "Confusing website navigation", value: "My biggest bottleneck is confusing website navigation - visitors leave quickly", icon: AlertTriangle },
  { label: "Not showing up in local search", value: "My biggest bottleneck is not showing up when people search for my services locally", icon: Globe },
  { label: "No system for capturing leads", value: "My biggest bottleneck is I have no system for capturing and following up with leads", icon: Users },
  { label: "Site doesn't convert visitors", value: "My biggest bottleneck is my site gets traffic but doesn't convert visitors into customers", icon: TrendingUp },
];

export function AuditChat({ isOpen, onClose }: AuditChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [conversationStage, setConversationStage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startConversation();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startConversation = async () => {
    setIsLoading(true);
    setShowProgress(true);
    setProgress(0);
    setConversationStage(1);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 15, 90));
    }, 200);

    try {
      const response = await fetch("/api/audit-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], stage: 1 }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setShowProgress(false);
      }, 500);

      if (!response.ok) throw new Error("Failed to start conversation");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages([{ role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              assistantMessage += data.content;
              setMessages([{ role: "assistant", content: assistantMessage }]);
            }
          } catch {}
        }
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      setMessages([{
        role: "assistant",
        content: "Aloha! I'm the Edify AI strategist. I'm here to help identify what's holding your Hawaii business back from its full growth potential.\n\nLet's start simple - what brings you here today?"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const userMessage = messageText || input.trim();
    if (!userMessage || isLoading) return;

    setInput("");
    
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);
    
    const newStage = conversationStage + 1;
    setConversationStage(newStage);

    try {
      const response = await fetch("/api/audit-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, stage: newStage }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              assistantMessage += data.content;
              setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
            }
          } catch {}
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([...newMessages, {
        role: "assistant",
        content: "I apologize, but I encountered an issue. Please try again or contact our team directly."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickOption = (option: QuickOption) => {
    sendMessage(option.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getCurrentOptions = (): QuickOption[] | null => {
    if (isLoading) return null;
    if (conversationStage === 1) return INITIAL_OPTIONS;
    if (conversationStage === 2) return PROBLEM_OPTIONS;
    return null;
  };

  const getAuditProgress = () => {
    const stages = 5;
    return Math.min((conversationStage / stages) * 100, 100);
  };

  if (!isOpen) return null;

  const quickOptions = getCurrentOptions();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl h-[80vh] max-h-[700px] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-primary/10 to-blue-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg shadow-primary/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white">Edify AI Strategist</h3>
                <p className="text-xs text-slate-400">Growth Audit for Hawaii Businesses</p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              data-testid="button-close-chat"
              className="text-slate-400"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {conversationStage > 0 && (
            <div className="px-4 py-2 bg-slate-800/30 border-b border-white/5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Audit Progress</span>
                <span>{Math.round(getAuditProgress())}%</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${getAuditProgress()}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {showProgress && (
            <div className="px-4 py-3 bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm text-slate-300">Initializing AI strategist...</span>
              </div>
              <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                data-testid={`message-${message.role}-${index}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  message.role === "assistant" 
                    ? "bg-gradient-to-br from-primary to-blue-500" 
                    : "bg-slate-700"
                }`}>
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "assistant" 
                    ? "bg-slate-800 text-slate-200" 
                    : "bg-primary text-white"
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content || (isLoading && message.role === "assistant" ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Thinking...
                      </span>
                    ) : "")}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {quickOptions && !isLoading && messages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2"
              >
                <p className="text-xs text-slate-500 mb-3 text-center">Quick responses:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickOptions.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleQuickOption(option)}
                      data-testid={`button-quick-option-${index}`}
                      className="h-auto py-3 px-4 text-left justify-start gap-3 bg-slate-800/50 border-white/10 text-slate-300 text-sm"
                    >
                      <option.icon className="w-4 h-4 text-primary shrink-0" />
                      <span>{option.label}</span>
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10 bg-slate-900/80">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={conversationStage <= 2 ? "Or type your own response..." : "Type your message..."}
                data-testid="input-chat-message"
                className="min-h-[48px] max-h-32 resize-none bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                disabled={isLoading}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                data-testid="button-send-message"
                className="shrink-0 bg-gradient-to-r from-primary to-blue-500"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              AI-powered insights. For personalized strategy, <Link href="/contact" className="text-primary" data-testid="link-book-call">book a call</Link> with our team.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function AuditChatTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        data-testid="button-start-audit"
        size="lg"
        className="bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg shadow-primary/30 group"
      >
        <Sparkles className="mr-2 w-5 h-5" />
        Start Your AI Audit
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
      <AuditChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export function FloatingAuditButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        data-testid="button-floating-audit"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-blue-500 text-white shadow-xl shadow-primary/40 flex items-center justify-center hover-elevate active-elevate-2 transition-shadow"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
      <AuditChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
