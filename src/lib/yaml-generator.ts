import { type YamlConfig } from './definitions';

const indent = (level: number) => '  '.repeat(level);

const buildComponent = (config: YamlConfig): string => {
  let yaml = `apiVersion: ${config.apiVersion}\n`;
  yaml += `kind: Component\n`;
  yaml += `metadata:\n`;
  yaml += `${indent(1)}name: ${config.component.name || 'my-component'}\n`;
  yaml += `${indent(1)}namespace: ${config.component.namespace || 'default'}\n`;
  yaml += `spec:\n`;
  yaml += `${indent(1)}owner:\n`;
  yaml += `${indent(2)}projectName: ${config.component.projectName || 'default'}\n`;
  yaml += `${indent(1)}type: ${config.component.type}\n`;

  if (config.build.enabled) {
    yaml += `${indent(1)}build:\n`;
    yaml += `${indent(2)}repository:\n`;
    yaml += `${indent(3)}url: ${config.build.repository.url}\n`;
    yaml += `${indent(3)}revision:\n`;
    yaml += `${indent(4)}branch: ${config.build.repository.branch}\n`;
    yaml += `${indent(3)}appPath: ${config.build.repository.appPath}\n`;
    yaml += `${indent(2)}templateRef:\n`;
    yaml += `${indent(3)}name: ${config.build.strategy}\n`;
    if (config.build.strategy === 'docker' && (config.build.parameters.dockerContext || config.build.parameters.dockerfilePath)) {
        yaml += `${indent(3)}parameters:\n`;
        if(config.build.parameters.dockerContext) yaml += `${indent(4)}- name: docker-context\n${indent(5)}value: ${config.build.parameters.dockerContext}\n`;
        if(config.build.parameters.dockerfilePath) yaml += `${indent(4)}- name: dockerfile-path\n${indent(5)}value: ${config.build.parameters.dockerfilePath}\n`;
    }
    if (config.build.strategy === 'react' && config.build.parameters.nodeVersion) {
        yaml += `${indent(3)}parameters:\n`;
        yaml += `${indent(4)}- name: node-version\n${indent(5)}value: "${config.build.parameters.nodeVersion}"\n`;
    }
  }

  return yaml;
};

const buildDefinition = (config: YamlConfig): string => {
    if (!config.build.enabled) return '';

    let yaml = `---\n`;
    yaml += `apiVersion: ${config.apiVersion}\n`;
    yaml += `kind: Build\n`;
    yaml += `metadata:\n`;
    yaml += `${indent(1)}name: ${config.component.name}-build-01\n`;
    yaml += `${indent(1)}namespace: ${config.component.namespace || 'default'}\n`;
    yaml += `spec:\n`;
    yaml += `${indent(1)}owner:\n`;
    yaml += `${indent(2)}componentName: ${config.component.name}\n`;
    yaml += `${indent(2)}projectName: ${config.component.projectName || 'default'}\n`;
    yaml += `${indent(1)}repository:\n`;
    yaml += `${indent(2)}url: ${config.build.repository.url}\n`;
    yaml += `${indent(2)}revision:\n`;
    yaml += `${indent(3)}branch: ${config.build.repository.branch}\n`;
    yaml += `${indent(2)}appPath: ${config.build.repository.appPath}\n`;
    yaml += `${indent(1)}templateRef:\n`;
    yaml += `${indent(2)}name: ${config.build.strategy}\n`;
    
    if (config.build.strategy === 'docker' && (config.build.parameters.dockerContext || config.build.parameters.dockerfilePath)) {
        yaml += `${indent(2)}parameters:\n`;
        if(config.build.parameters.dockerContext) yaml += `${indent(3)}- name: docker-context\n${indent(4)}value: ${config.build.parameters.dockerContext}\n`;
        if(config.build.parameters.dockerfilePath) yaml += `${indent(3)}- name: dockerfile-path\n${indent(4)}value: ${config.build.parameters.dockerfilePath}\n`;
    }
    if (config.build.strategy === 'react' && config.build.parameters.nodeVersion) {
        yaml += `${indent(2)}parameters:\n`;
        yaml += `${indent(3)}- name: node-version\n${indent(4)}value: "${config.build.parameters.nodeVersion}"\n`;
    }
    
    return yaml;
}

const workloadDefinition = (config: YamlConfig): string => {
    if (!config.workload.enabled) return '';
    let yaml = `---\n`;
    yaml += `apiVersion: ${config.apiVersion}\n`;
    yaml += `kind: Workload\n`;
    yaml += `metadata:\n`;
    yaml += `${indent(1)}name: ${config.workload.name}\n`;
    yaml += `${indent(1)}namespace: ${config.component.namespace}\n`;
    yaml += `spec:\n`;
    yaml += `${indent(1)}owner:\n`;
    yaml += `${indent(2)}componentName: ${config.component.name}\n`;
    yaml += `${indent(2)}projectName: ${config.component.projectName}\n`;
    yaml += `${indent(1)}containers:\n`;
    yaml += `${indent(2)}main:\n`;
    yaml += `${indent(3)}image: ${config.workload.image}\n`;

    if (config.workload.command) {
        yaml += `${indent(3)}command:\n`;
        yaml += `${indent(4)}- ${config.workload.command}\n`;
    }
    if (config.workload.args) {
        yaml += `${indent(3)}args:\n`;
        config.workload.args.split(' ').forEach(arg => {
            yaml += `${indent(4)}- "${arg}"\n`;
        });
    }

    if (config.workload.env.length > 0 && config.workload.env.some(e => e.key)) {
        yaml += `${indent(3)}env:\n`;
        config.workload.env.forEach(env => {
            if(env.key) yaml += `${indent(4)}- key: ${env.key}\n${indent(5)}value: ${env.value}\n`;
        });
    }

    if(config.component.type === 'Service' && config.workload.port) {
      yaml += `${indent(1)}endpoints:\n`;
      yaml += `${indent(2)}rest-api:\n`;
      yaml += `${indent(3)}type: REST\n`;
      yaml += `${indent(3)}port: ${config.workload.port}\n`;
    }

    return yaml;
}

const deploymentDefinition = (config: YamlConfig): string => {
  let yaml = `---\n`;
  yaml += `apiVersion: ${config.apiVersion}\n`;
  yaml += `kind: ${config.component.type}\n`;
  yaml += `metadata:\n`;
  yaml += `${indent(1)}name: ${config.component.name}\n`;
  yaml += `${indent(1)}namespace: ${config.component.namespace || 'default'}\n`;
  yaml += `spec:\n`;
  yaml += `${indent(1)}owner:\n`;
  yaml += `${indent(2)}componentName: ${config.component.name}\n`;
  yaml += `${indent(2)}projectName: ${config.component.projectName || 'default'}\n`;
  yaml += `${indent(1)}workloadName: ${config.deployment.workloadName}\n`;
  
  if (config.component.type === 'Service') {
    if (config.deployment.apis.length > 0 && config.deployment.apis.some(api => api.name)) {
      yaml += `${indent(1)}apis:\n`;
      config.deployment.apis.forEach(api => {
        if (!api.name) return;
        yaml += `${indent(2)}${api.name}:\n`;
        yaml += `${indent(3)}type: ${api.type}\n`;
        yaml += `${indent(3)}rest:\n`;
        yaml += `${indent(4)}backend:\n`;
        yaml += `${indent(5)}port: ${api.port}\n`;
        yaml += `${indent(5)}basePath: ${api.basePath}\n`;
        yaml += `${indent(4)}exposeLevels: [${api.exposeLevels.map(l => `"${l}"`).join(', ')}]\n`;
      });
    }
  }

  return yaml;
};


export const generateYaml = (config: YamlConfig): string => {
  const parts = [
    buildComponent(config),
    buildDefinition(config),
    workloadDefinition(config),
    deploymentDefinition(config)
  ];

  return parts.filter(p => p).join('\n');
};
