import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Users,
  Bot,
  BarChart3,
  MessageSquare,
  Settings,
  Zap,
  Database,
  Radio,
  Building2,
  Globe,
  Mail,
  QrCode,
  CheckCircle,
  Home,
  Calendar,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Leads",
    url: "/admin/leads",
    icon: Users,
    badge: "Pipeline",
  },
  {
    title: "Clients",
    url: "/admin/clients",
    icon: Building2,
  },
  {
    title: "Assets",
    url: "/admin/assets",
    icon: Globe,
  },
  {
    title: "AI Agents",
    url: "/admin/agents",
    icon: Bot,
    badge: "7 Active",
  },
  {
    title: "Nurturing",
    url: "/admin/nurturing",
    icon: Mail,
    badge: "Auto",
  },
  {
    title: "Calendar",
    url: "/admin/calendar",
    icon: Calendar,
  },
  {
    title: "Sample Sites",
    url: "/admin/sample-sites",
    icon: QrCode,
    badge: "Preview",
  },
  {
    title: "Approval Queue",
    url: "/admin/approval-queue",
    icon: CheckCircle,
    badge: "Review",
  },
  {
    title: "Event Stream",
    url: "/admin/events",
    icon: Radio,
    badge: "Live",
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
  },
];

const integrationItems = [
  {
    title: "External CRM",
    url: "/admin/external",
    icon: Database,
  },
  {
    title: "Conversations",
    url: "/admin/conversations",
    icon: MessageSquare,
  },
];

const systemItems = [
  {
    title: "Agent Config",
    url: "/admin/config",
    icon: Zap,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Back to Site",
    url: "/",
    icon: Home,
  },
];

export function AdminSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-primary">
            <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-sidebar-foreground">Edify CRM</span>
            <span className="text-xs text-sidebar-foreground/60">AI-Powered Sales</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-[10px]">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Integrations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {integrationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 rounded-md bg-sidebar-accent/50 p-3">
          <div className="flex h-2 w-2 items-center justify-center">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
          </div>
          <span className="text-xs text-sidebar-foreground/70">All systems operational</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
