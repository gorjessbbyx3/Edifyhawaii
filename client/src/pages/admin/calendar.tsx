import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Phone,
  Mail,
  Video,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Meeting, Lead, ScheduledMessage, Business } from "@shared/schema";

type EnrichedMeeting = Meeting & {
  lead?: Lead & { business?: Business };
};

const meetingSchema = z.object({
  leadId: z.string().min(1, "Lead is required"),
  scheduledAt: z.string().min(1, "Date and time is required"),
  meetingLink: z.string().optional(),
  status: z.string().default("scheduled"),
});

type MeetingForm = z.infer<typeof meetingSchema>;

const eventColors: Record<string, string> = {
  meeting: "bg-blue-500",
  call: "bg-green-500",
  email: "bg-purple-500",
  follow_up: "bg-orange-500",
  scheduled: "bg-blue-500",
  completed: "bg-gray-500",
  cancelled: "bg-red-500",
};

function getWeekDays(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const weekDays = getWeekDays(currentDate);

  const form = useForm<MeetingForm>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      leadId: "",
      scheduledAt: "",
      meetingLink: "",
      status: "scheduled",
    },
  });

  const { data: meetings = [], isLoading: meetingsLoading } = useQuery<EnrichedMeeting[]>({
    queryKey: ["/api/meetings"],
  });

  const { data: leads = [] } = useQuery<(Lead & { business?: Business })[]>({
    queryKey: ["/api/leads"],
  });

  const { data: scheduledMessages = [] } = useQuery<ScheduledMessage[]>({
    queryKey: ["/api/scheduled-messages"],
  });

  const addMeetingMutation = useMutation({
    mutationFn: async (data: MeetingForm) => {
      const response = await apiRequest("POST", "/api/meetings", {
        ...data,
        scheduledAt: new Date(data.scheduledAt).toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meetings"] });
      setAddDialogOpen(false);
      form.reset();
      toast({
        title: "Meeting scheduled",
        description: "The meeting has been added to your calendar.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create meeting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MeetingForm) => {
    addMeetingMutation.mutate(data);
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDay = (day: Date) => {
    const dayMeetings = meetings.filter((m) => 
      isSameDay(new Date(m.scheduledAt), day)
    ).map((m) => ({
      id: m.id,
      type: "meeting" as const,
      time: new Date(m.scheduledAt),
      title: m.lead?.business?.name || "Meeting",
      status: m.status,
      meetingLink: m.meetingLink,
    }));

    const dayMessages = scheduledMessages.filter((m) => 
      isSameDay(new Date(m.scheduledFor), day)
    ).map((m) => ({
      id: m.id,
      type: m.channel as "email" | "sms",
      time: new Date(m.scheduledFor),
      title: m.subject || "Scheduled Message",
      status: m.status,
    }));

    return [...dayMeetings, ...dayMessages].sort((a, b) => a.time.getTime() - b.time.getTime());
  };

  const formatWeekRange = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    const startMonth = start.toLocaleDateString("en-US", { month: "short" });
    const endMonth = end.toLocaleDateString("en-US", { month: "short" });
    const year = end.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${year}`;
    }
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage scheduled contacts, meetings, and follow-ups
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-meeting">
              <Plus className="mr-2 h-4 w-4" />
              Add Meeting
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
              <DialogDescription>
                Add a meeting or call with a lead.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="leadId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-lead">
                            <SelectValue placeholder="Select a lead" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {leads.map((lead) => (
                            <SelectItem key={lead.id} value={lead.id}>
                              {lead.business?.name || `Lead ${lead.id.slice(0, 8)}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scheduledAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} data-testid="input-datetime" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="meetingLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Link (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://zoom.us/j/..." {...field} data-testid="input-meeting-link" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={addMeetingMutation.isPending} data-testid="button-submit-meeting">
                    {addMeetingMutation.isPending ? "Scheduling..." : "Schedule Meeting"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateWeek(-1)} data-testid="button-prev-week">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateWeek(1)} data-testid="button-next-week">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday} data-testid="button-today">
            Today
          </Button>
        </div>
        <h2 className="text-xl font-semibold">{formatWeekRange()}</h2>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-500 text-white">Meetings</Badge>
          <Badge className="bg-purple-500 text-white">Emails</Badge>
          <Badge className="bg-green-500 text-white">Calls</Badge>
          <Badge className="bg-orange-500 text-white">Follow-ups</Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {meetingsLoading ? (
            <div className="p-6">
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-7 divide-x">
              {weekDays.map((day, index) => {
                const isToday = isSameDay(day, new Date());
                const events = getEventsForDay(day);
                const dayName = day.toLocaleDateString("en-US", { weekday: "short" });
                const dayNum = day.getDate();

                return (
                  <div key={index} className="min-h-[400px]">
                    <div className={`p-3 text-center border-b ${isToday ? "bg-primary/10" : ""}`}>
                      <div className="text-sm text-muted-foreground">{dayName}</div>
                      <div className={`text-2xl font-bold ${isToday ? "text-primary" : ""}`}>
                        {dayNum}
                      </div>
                    </div>
                    <div className="p-2 space-y-2">
                      {events.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground py-4">
                          No events
                        </div>
                      ) : (
                        events.map((event) => (
                          <div
                            key={`${event.type}-${event.id}`}
                            className={`p-2 rounded-md text-white text-xs ${eventColors[event.status] || eventColors[event.type]}`}
                            data-testid={`event-${event.type}-${event.id}`}
                          >
                            <div className="flex items-center gap-1 mb-1">
                              {event.type === "meeting" && <Video className="h-3 w-3" />}
                              {event.type === "email" && <Mail className="h-3 w-3" />}
                              {event.type === "sms" && <Phone className="h-3 w-3" />}
                              <span className="font-medium">{formatTime(event.time)}</span>
                            </div>
                            <div className="truncate">{event.title}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Upcoming This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          {meetings.filter((m) => {
            const meetingDate = new Date(m.scheduledAt);
            return meetingDate >= weekDays[0] && meetingDate <= weekDays[6];
          }).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No meetings scheduled this week</p>
              <p className="text-sm">Click "Add Meeting" to schedule one</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meetings
                .filter((m) => {
                  const meetingDate = new Date(m.scheduledAt);
                  return meetingDate >= weekDays[0] && meetingDate <= weekDays[6];
                })
                .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                .map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    data-testid={`upcoming-meeting-${meeting.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${eventColors[meeting.status]}`} />
                      <div>
                        <div className="font-medium">
                          {meeting.lead?.business?.name || "Meeting"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(meeting.scheduledAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${eventColors[meeting.status]} text-white border-0`}>
                      {meeting.status}
                    </Badge>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
