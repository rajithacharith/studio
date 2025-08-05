import { type YamlConfig, type TemplateName } from './definitions';

export const initialConfig: YamlConfig = {
    apiVersion: 'openchoreo.dev/v1alpha1',
    component: {
      name: 'my-service',
      namespace: 'default',
      projectName: 'default',
      type: 'Service',
    },
    build: {
      enabled: true,
      strategy: 'google-cloud-buildpacks',
      repository: {
        url: 'https://github.com/openchoreo/sample-workloads',
        branch: 'main',
        appPath: '/service-go-reading-list',
      },
      parameters: {},
    },
    deployment: {
      workloadName: 'my-service-workload',
      apis: [{
        id: crypto.randomUUID(),
        name: 'my-api',
        type: 'REST',
        port: '8080',
        basePath: '/api/v1',
        exposeLevels: ['Public']
      }],
    },
    workload: {
      enabled: false,
      name: 'my-service-workload',
      image: '',
      command: '',
      args: '',
      env: [],
      port: '8080'
    },
};

const serviceBuildFromSource: YamlConfig = { ...initialConfig };

const servicePreBuiltImage: YamlConfig = {
  ...initialConfig,
  component: {
    name: 'greeter-service',
    namespace: 'default',
    projectName: 'default',
    type: 'Service',
  },
  build: {
    enabled: false,
    strategy: 'google-cloud-buildpacks',
    repository: { url: '', branch: '', appPath: ''},
    parameters: {},
  },
  deployment: {
    workloadName: 'greeter-service-workload',
    apis: [{
        id: crypto.randomUUID(),
        name: 'greeter-api',
        type: 'REST',
        port: '9090',
        basePath: '/greeter',
        exposeLevels: ['Organization', 'Public']
    }]
  },
  workload: {
    enabled: true,
    name: 'greeter-service-workload',
    image: 'ghcr.io/openchoreo/samples/greeter-service:latest',
    command: './go-greeter',
    args: '--port 9090',
    env: [{id: crypto.randomUUID(), key: 'LOG_LEVEL', value: 'info'}],
    port: '9090',
  }
};

const reactWebApp: YamlConfig = {
    ...initialConfig,
    component: {
      name: 'frontend-app',
      namespace: 'default',
      projectName: 'default',
      type: 'WebApplication',
    },
    build: {
      enabled: true,
      strategy: 'react',
      repository: {
        url: 'https://github.com/your-org/frontend-app',
        branch: 'main',
        appPath: '/',
      },
      parameters: { nodeVersion: '18' },
    },
    deployment: {
      workloadName: 'frontend-app-workload',
      apis: [],
    },
    workload: {
        ...initialConfig.workload,
        enabled: false,
    }
};

const scheduledTask: YamlConfig = {
    ...initialConfig,
    component: {
      name: 'data-processor',
      namespace: 'default',
      projectName: 'default',
      type: 'ScheduledTask',
    },
    build: {
      enabled: false,
      strategy: 'google-cloud-buildpacks',
      repository: { url: '', branch: '', appPath: '' },
      parameters: {},
    },
    deployment: {
      workloadName: 'data-processor-workload',
      apis: [],
    },
    workload: {
        enabled: true,
        name: 'data-processor-workload',
        image: 'ghcr.io/your-org/data-processor:latest',
        command: '',
        args: '',
        env: [
            { id: crypto.randomUUID(), key: 'DATABASE_HOST', value: 'postgres.internal' },
            { id: crypto.randomUUID(), key: 'BATCH_SIZE', value: '1000' }
        ],
        port: ''
    }
};

export const templates: Record<TemplateName, YamlConfig> = {
    'service-build-from-source': serviceBuildFromSource,
    'service-pre-built-image': servicePreBuiltImage,
    'react-web-app': reactWebApp,
    'scheduled-task': scheduledTask,
};
