export type ComponentType = 'Service' | 'WebApplication' | 'ScheduledTask';
export type BuildStrategy = 'google-cloud-buildpacks' | 'docker' | 'react' | 'ballerina-buildpack';
export type ApiType = 'REST' | 'GraphQL' | 'WebSocket';
export type ExposeLevel = 'Public' | 'Organization';
export type TemplateName = 
    | 'service-build-from-source'
    | 'service-pre-built-image'
    | 'react-web-app'
    | 'scheduled-task';


export interface ApiEndpoint {
  id: string;
  name: string;
  type: ApiType;
  port: string;
  basePath: string;
  exposeLevels: ExposeLevel[];
}

export interface EnvVar {
  id: string;
  key: string;
  value: string;
}

export interface YamlConfig {
  apiVersion: string;
  component: {
    name: string;
    namespace: string;
    projectName: string;
    type: ComponentType;
  };
  build: {
    enabled: boolean;
    strategy: BuildStrategy;
    repository: {
      url: string;
      branch: string;
      appPath: string;
    };
    parameters: {
      dockerContext?: string;
      dockerfilePath?: string;
      nodeVersion?: string;
    };
  };
  deployment: {
    workloadName: string;
    // Service specific
    apis: ApiEndpoint[];
  };
  workload: {
    enabled: boolean; 
    name: string;
    image: string;
    command: string;
    args: string;
    env: EnvVar[];
    port: string;
  };
}

export type WorkloadEndpointType = 'REST' | 'GraphQL' | 'gRPC' | 'TCP' | 'UDP' | 'HTTP' | 'Websocket';

export interface WorkloadEndpoint {
    id: string;
    name: string;
    port: number;
    type: WorkloadEndpointType;
    schemaFile: string;
}

export interface WorkloadDescriptor {
    apiVersion: string;
    name: string;
    endpoints: WorkloadEndpoint[];
}
