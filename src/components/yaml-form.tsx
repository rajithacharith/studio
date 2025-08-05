'use client';

import { type YamlConfig, type ApiEndpoint, type EnvVar } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface YamlFormProps {
  config: YamlConfig;
  setConfig: (config: YamlConfig) => void;
}

export function YamlForm({ config, setConfig }: YamlFormProps) {
  const handleInputChange = (part: keyof YamlConfig, field: string, value: any) => {
    const newConfig = { ...config };
    (newConfig[part] as any)[field] = value;
    setConfig(newConfig);
  };
  
  const handleNestedInputChange = (part: keyof YamlConfig, nested: string, field: string, value: any) => {
    const newConfig = { ...config };
    ((newConfig[part] as any)[nested] as any)[field] = value;
    setConfig(newConfig);
  };

  const addApi = () => {
    const newApi: ApiEndpoint = { id: crypto.randomUUID(), name: '', type: 'REST', port: '8080', basePath: '', exposeLevels: ['Organization'] };
    setConfig({ ...config, deployment: { ...config.deployment, apis: [...config.deployment.apis, newApi] } });
  };
  const removeApi = (id: string) => {
    setConfig({ ...config, deployment: { ...config.deployment, apis: config.deployment.apis.filter(api => api.id !== id) } });
  };
  const handleApiChange = (id: string, field: keyof ApiEndpoint, value: any) => {
    const apis = config.deployment.apis.map(api => api.id === id ? { ...api, [field]: value } : api);
    setConfig({ ...config, deployment: { ...config.deployment, apis } });
  };
  
  const addEnvVar = () => {
    const newEnvVar: EnvVar = { id: crypto.randomUUID(), key: '', value: '' };
    setConfig({ ...config, workload: { ...config.workload, env: [...config.workload.env, newEnvVar] } });
  };
  const removeEnvVar = (id: string) => {
    setConfig({ ...config, workload: { ...config.workload, env: config.workload.env.filter(e => e.id !== id) } });
  };
  const handleEnvVarChange = (id: string, field: keyof EnvVar, value: any) => {
    const env = config.workload.env.map(e => e.id === id ? { ...e, [field]: value } : e);
    setConfig({ ...config, workload: { ...config.workload, env } });
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">YAML Configuration</CardTitle>
        <CardDescription>Fill in the details to generate your OpenChoreo YAML file.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh] pr-4">
        <Tabs defaultValue="component" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="component">Component</TabsTrigger>
            <TabsTrigger value="build">Build</TabsTrigger>
            <TabsTrigger value="workload" disabled={config.build.enabled}>Workload</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="component" className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold font-headline">Component Details</h3>
            <div className="space-y-2">
              <Label htmlFor="component-name">Component Name</Label>
              <Input id="component-name" value={config.component.name} onChange={(e) => handleInputChange('component', 'name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="component-type">Component Type</Label>
              <Select value={config.component.type} onValueChange={(value) => handleInputChange('component', 'type', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="WebApplication">Web Application</SelectItem>
                  <SelectItem value="ScheduledTask">Scheduled Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input id="project-name" value={config.component.projectName} onChange={(e) => handleInputChange('component', 'projectName', e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="namespace">Namespace</Label>
              <Input id="namespace" value={config.component.namespace} onChange={(e) => handleInputChange('component', 'namespace', e.target.value)} />
            </div>
          </TabsContent>

          <TabsContent value="build" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold font-headline">Build from Source</h3>
                <div className="flex items-center gap-2">
                    <Label htmlFor="build-enabled">Enable</Label>
                    <Switch id="build-enabled" checked={config.build.enabled} onCheckedChange={(checked) => {
                        const newConfig = {...config, build: {...config.build, enabled: checked}, workload: {...config.workload, enabled: !checked}};
                        setConfig(newConfig);
                    }}/>
                </div>
            </div>
             {config.build.enabled && (
                 <div className="space-y-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                        <Label htmlFor="build-strategy">Build Strategy</Label>
                        <Select value={config.build.strategy} onValueChange={(value) => handleNestedInputChange('build', 'strategy', value, value)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="google-cloud-buildpacks">Google Cloud Buildpacks</SelectItem>
                                <SelectItem value="docker">Dockerfile</SelectItem>
                                <SelectItem value="react">React Buildpack</SelectItem>
                                <SelectItem value="ballerina-buildpack">Ballerina Buildpack</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="repo-url">Repository URL</Label>
                        <Input id="repo-url" value={config.build.repository.url} onChange={(e) => handleNestedInputChange('build', 'repository', 'url', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="repo-branch">Branch</Label>
                            <Input id="repo-branch" value={config.build.repository.branch} onChange={(e) => handleNestedInputChange('build', 'repository', 'branch', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="app-path">App Path</Label>
                            <Input id="app-path" value={config.build.repository.appPath} onChange={(e) => handleNestedInputChange('build', 'repository', 'appPath', e.target.value)} />
                        </div>
                    </div>
                    {config.build.strategy === 'docker' && (
                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-semibold">Dockerfile Parameters</h4>
                            <div className="space-y-2">
                                <Label htmlFor="docker-context">Docker Context</Label>
                                <Input id="docker-context" value={config.build.parameters.dockerContext} onChange={(e) => handleNestedInputChange('build', 'parameters', 'dockerContext', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dockerfile-path">Dockerfile Path</Label>
                                <Input id="dockerfile-path" value={config.build.parameters.dockerfilePath} onChange={(e) => handleNestedInputChange('build', 'parameters', 'dockerfilePath', e.target.value)} />
                            </div>
                        </div>
                    )}
                    {config.build.strategy === 'react' && (
                         <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-semibold">React Parameters</h4>
                            <div className="space-y-2">
                                <Label htmlFor="node-version">Node Version</Label>
                                <Input id="node-version" value={config.build.parameters.nodeVersion} onChange={(e) => handleNestedInputChange('build', 'parameters', 'nodeVersion', e.target.value)} />
                            </div>
                        </div>
                    )}
                 </div>
             )}
          </TabsContent>
          
          <TabsContent value="workload" className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold font-headline">Pre-built Image Workload</h3>
            <div className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                    <Label htmlFor="workload-name">Workload Name</Label>
                    <Input id="workload-name" value={config.workload.name} onChange={(e) => handleInputChange('workload', 'name', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="image-name">Container Image</Label>
                    <Input id="image-name" placeholder="e.g. nginx:latest" value={config.workload.image} onChange={(e) => handleInputChange('workload', 'image', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="container-port">Container Port (for Service)</Label>
                    <Input id="container-port" placeholder="e.g. 80" value={config.workload.port} onChange={(e) => handleInputChange('workload', 'port', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="command">Command</Label>
                    <Input id="command" value={config.workload.command} onChange={(e) => handleInputChange('workload', 'command', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="args">Arguments (space separated)</Label>
                    <Input id="args" value={config.workload.args} onChange={(e) => handleInputChange('workload', 'args', e.target.value)} />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label>Environment Variables</Label>
                        <Button variant="ghost" size="sm" onClick={addEnvVar}><PlusCircle className="w-4 h-4 mr-2" />Add</Button>
                    </div>
                    <div className="space-y-2">
                        {config.workload.env.map((env, index) => (
                             <div key={env.id} className="flex gap-2 items-center">
                                <Input placeholder="Key" value={env.key} onChange={e => handleEnvVarChange(env.id, 'key', e.target.value)} />
                                <Input placeholder="Value" value={env.value} onChange={e => handleEnvVarChange(env.id, 'value', e.target.value)} />
                                <Button variant="ghost" size="icon" onClick={() => removeEnvVar(env.id)}><Trash2 className="w-4 h-4 text-destructive"/></Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold font-headline">Deployment Details</h3>
            <div className="space-y-2">
              <Label htmlFor="deployment-workload-name">Workload Name</Label>
              <Input id="deployment-workload-name" value={config.deployment.workloadName} onChange={(e) => handleInputChange('deployment', 'workloadName', e.target.value)} />
            </div>

            {config.component.type === 'Service' && (
              <div className="space-y-4 pt-4 border-t">
                 <div className="flex items-center justify-between">
                    <h4 className="font-semibold">API Endpoints</h4>
                    <Button variant="ghost" size="sm" onClick={addApi}><PlusCircle className="w-4 h-4 mr-2"/>Add API</Button>
                </div>
                {config.deployment.apis.map((api, index) => (
                  <div key={api.id} className="space-y-3 p-3 border rounded-md">
                     <div className="flex justify-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeApi(api.id)}><Trash2 className="w-4 h-4 text-destructive"/></Button>
                     </div>
                    <div className="space-y-2">
                      <Label htmlFor={`api-name-${index}`}>API Name</Label>
                      <Input id={`api-name-${index}`} value={api.name} onChange={(e) => handleApiChange(api.id, 'name', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor={`api-port-${index}`}>Backend Port</Label>
                            <Input id={`api-port-${index}`} value={api.port} onChange={(e) => handleApiChange(api.id, 'port', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor={`api-type-${index}`}>API Type</Label>
                            <Select value={api.type} onValueChange={(value) => handleApiChange(api.id, 'type', value)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="REST">REST</SelectItem>
                                    <SelectItem value="GraphQL">GraphQL</SelectItem>
                                    <SelectItem value="WebSocket">WebSocket</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`api-basepath-${index}`}>Base Path</Label>
                      <Input id={`api-basepath-${index}`} value={api.basePath} onChange={(e) => handleApiChange(api.id, 'basePath', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Exposure Levels</Label>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <Switch id={`expose-public-${index}`} 
                                    checked={api.exposeLevels.includes('Public')} 
                                    onCheckedChange={(checked) => {
                                        const levels = checked ? [...api.exposeLevels, 'Public'] : api.exposeLevels.filter(l => l !== 'Public');
                                        handleApiChange(api.id, 'exposeLevels', levels);
                                    }}/>
                                <Label htmlFor={`expose-public-${index}`}>Public</Label>
                            </div>
                             <div className="flex items-center gap-2">
                                <Switch id={`expose-org-${index}`} 
                                    checked={api.exposeLevels.includes('Organization')} 
                                    onCheckedChange={(checked) => {
                                        const levels = checked ? [...api.exposeLevels, 'Organization'] : api.exposeLevels.filter(l => l !== 'Organization');
                                        handleApiChange(api.id, 'exposeLevels', levels);
                                    }}/>
                                <Label htmlFor={`expose-org-${index}`}>Organization</Label>
                            </div>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
