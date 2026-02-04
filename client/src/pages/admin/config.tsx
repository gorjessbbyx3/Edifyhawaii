import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Shield,
  UserSearch,
  Phone,
  BarChart3,
  FileText,
  Bot,
  Settings,
  Save,
  RotateCcw,
  Zap,
  Clock,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { agentDefinitions } from "@shared/schema";

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Shield,
  UserSearch,
  Phone,
  BarChart3,
  FileText,
};

interface AgentConfig {
  id: string;
  enabled: boolean;
  autoRun: boolean;
  interval: number;
  maxLeadsPerRun: number;
  targetIndustries: string[];
  targetLocation: string;
}

function AgentConfigCard({ definition }: { definition: typeof agentDefinitions[number] }) {
  const Icon = iconMap[definition.icon] || Bot;
  const [config, setConfig] = useState<AgentConfig>({
    id: definition.id,
    enabled: true,
    autoRun: false,
    interval: 30,
    maxLeadsPerRun: 50,
    targetIndustries: [],
    targetLocation: "Hawaii",
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configuration saved",
      description: `${definition.name} settings have been updated.`,
    });
  };

  return (
    <Card data-testid={`config-card-${definition.id}`}>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">{definition.name}</CardTitle>
            <CardDescription className="mt-1">{definition.description}</CardDescription>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
            data-testid={`switch-enable-${definition.id}`}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-run</Label>
            <p className="text-xs text-muted-foreground">
              Automatically run at scheduled intervals
            </p>
          </div>
          <Switch
            checked={config.autoRun}
            onCheckedChange={(checked) => setConfig({ ...config, autoRun: checked })}
            disabled={!config.enabled}
          />
        </div>

        {config.autoRun && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Run interval</Label>
              <span className="text-sm text-muted-foreground">{config.interval} minutes</span>
            </div>
            <Slider
              value={[config.interval]}
              onValueChange={([value]) => setConfig({ ...config, interval: value })}
              min={5}
              max={120}
              step={5}
              disabled={!config.enabled}
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Max leads per run</Label>
            <span className="text-sm text-muted-foreground">{config.maxLeadsPerRun}</span>
          </div>
          <Slider
            value={[config.maxLeadsPerRun]}
            onValueChange={([value]) => setConfig({ ...config, maxLeadsPerRun: value })}
            min={10}
            max={200}
            step={10}
            disabled={!config.enabled}
          />
        </div>

        {(definition.type === "crawler" || definition.type === "verifier") && (
          <div className="space-y-2">
            <Label>Target Location</Label>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Input
                value={config.targetLocation}
                onChange={(e) => setConfig({ ...config, targetLocation: e.target.value })}
                placeholder="e.g., Hawaii, California"
                disabled={!config.enabled}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => setConfig({ ...config })}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button size="sm" className="flex-1" onClick={handleSave} disabled={!config.enabled}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Config() {
  const [globalSettings, setGlobalSettings] = useState({
    tcpaCompliance: true,
    dncChecking: true,
    callRecording: true,
    maxConcurrentAgents: 3,
    retryAttempts: 3,
    notificationsEnabled: true,
  });

  const { toast } = useToast();

  const handleSaveGlobal = () => {
    toast({
      title: "Global settings saved",
      description: "Your agent configuration has been updated.",
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold" data-testid="text-config-title">Agent Configuration</h1>
        <p className="text-muted-foreground">
          Configure your AI agents and automation settings
        </p>
      </div>

      <Tabs defaultValue="agents">
        <TabsList>
          <TabsTrigger value="agents" data-testid="tab-agents-config">
            <Bot className="mr-2 h-4 w-4" />
            Individual Agents
          </TabsTrigger>
          <TabsTrigger value="global" data-testid="tab-global-config">
            <Settings className="mr-2 h-4 w-4" />
            Global Settings
          </TabsTrigger>
          <TabsTrigger value="compliance" data-testid="tab-compliance">
            <Shield className="mr-2 h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agentDefinitions.map((definition) => (
              <AgentConfigCard key={definition.id} definition={definition} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="global" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Settings</CardTitle>
                <CardDescription>Control agent execution and resource usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Max concurrent agents</Label>
                    <span className="text-sm text-muted-foreground">
                      {globalSettings.maxConcurrentAgents}
                    </span>
                  </div>
                  <Slider
                    value={[globalSettings.maxConcurrentAgents]}
                    onValueChange={([value]) =>
                      setGlobalSettings({ ...globalSettings, maxConcurrentAgents: value })
                    }
                    min={1}
                    max={6}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Limit how many agents can run simultaneously
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Retry attempts</Label>
                    <span className="text-sm text-muted-foreground">
                      {globalSettings.retryAttempts}
                    </span>
                  </div>
                  <Slider
                    value={[globalSettings.retryAttempts]}
                    onValueChange={([value]) =>
                      setGlobalSettings({ ...globalSettings, retryAttempts: value })
                    }
                    min={0}
                    max={5}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of retry attempts for failed operations
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified about agent activities
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.notificationsEnabled}
                    onCheckedChange={(checked) =>
                      setGlobalSettings({ ...globalSettings, notificationsEnabled: checked })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveGlobal} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Integration</CardTitle>
                <CardDescription>External CRM and service connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Edify CRM API Status</Label>
                  <div className="flex items-center gap-2 rounded-md bg-green-100 dark:bg-green-900/30 p-3">
                    <div className="flex h-2 w-2">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                      </span>
                    </div>
                    <span className="text-sm text-green-700 dark:text-green-300">Connected</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>API Endpoint</Label>
                  <Input value="https://edifylimited.tech" disabled />
                </div>

                <div className="rounded-md bg-muted p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">API Key</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Configured via environment variable (AGENT_API_KEY)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>TCPA Compliance</CardTitle>
                </div>
                <CardDescription>
                  Telephone Consumer Protection Act settings for AI Voice Caller
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable TCPA compliance</Label>
                    <p className="text-xs text-muted-foreground">
                      Ensure all calls follow TCPA regulations
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.tcpaCompliance}
                    onCheckedChange={(checked) =>
                      setGlobalSettings({ ...globalSettings, tcpaCompliance: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>DNC list checking</Label>
                    <p className="text-xs text-muted-foreground">
                      Check numbers against Do Not Call registry
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.dncChecking}
                    onCheckedChange={(checked) =>
                      setGlobalSettings({ ...globalSettings, dncChecking: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Call recording</Label>
                    <p className="text-xs text-muted-foreground">
                      Record calls for quality and compliance
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.callRecording}
                    onCheckedChange={(checked) =>
                      setGlobalSettings({ ...globalSettings, callRecording: checked })
                    }
                  />
                </div>

                <div className="rounded-md border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Important Notice
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Disabling compliance features may expose you to legal liability. 
                        Consult with legal counsel before making changes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveGlobal} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Compliance Settings
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calling Hours</CardTitle>
                <CardDescription>Define allowed times for AI voice calls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start time</Label>
                    <Select defaultValue="09:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                          <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                            {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>End time</Label>
                    <Select defaultValue="18:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 12).map((hour) => (
                          <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                            {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="HST">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HST">Hawaii-Aleutian (HST)</SelectItem>
                      <SelectItem value="PST">Pacific (PST)</SelectItem>
                      <SelectItem value="MST">Mountain (MST)</SelectItem>
                      <SelectItem value="CST">Central (CST)</SelectItem>
                      <SelectItem value="EST">Eastern (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Calls are only allowed between these hours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
