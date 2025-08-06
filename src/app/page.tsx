
'use client';

import { useState, useEffect } from 'react';
import { type YamlConfig, type TemplateName, type WorkloadDescriptor } from '@/lib/definitions';
import { generateYaml, generateWorkloadDescriptorYaml } from '@/lib/yaml-generator';
import { YamlForm } from '@/components/yaml-form';
import { YamlPreview } from '@/components/yaml-preview';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { initialConfig, templates, initialWorkloadDescriptor } from '@/lib/templates';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [config, setConfig] = useState<YamlConfig>(initialConfig);
  const [workloadDescriptor, setWorkloadDescriptor] = useState<WorkloadDescriptor>(initialWorkloadDescriptor);
  const [yamlString, setYamlString] = useState('');
  const [workloadDescriptorYamlString, setWorkloadDescriptorYamlString] = useState('');
  const [activeTemplate, setActiveTemplate] = useState<TemplateName | 'custom'>('service-build-from-source');

  useEffect(() => {
    const newYaml = generateYaml(config);
    setYamlString(newYaml);
    if (config.build.enabled) {
      const newWorkloadDescriptorYaml = generateWorkloadDescriptorYaml(workloadDescriptor);
      setWorkloadDescriptorYamlString(newWorkloadDescriptorYaml);
    }
  }, [config, workloadDescriptor]);

  useEffect(() => {
    // Keep workload descriptor name in sync with deployment workload name
    if (config.deployment.workloadName !== workloadDescriptor.name) {
      setWorkloadDescriptor(prev => ({...prev, name: config.deployment.workloadName}));
    }
  }, [config.deployment.workloadName, workloadDescriptor.name]);

  const handleTemplateSelect = (templateName: TemplateName) => {
    const newConfig = templates[templateName];
    setConfig(newConfig);
    // Also reset workload descriptor when template changes
    if (newConfig.build.enabled) {
      setWorkloadDescriptor({
        ...initialWorkloadDescriptor,
        name: newConfig.deployment.workloadName,
      });
    }
    setActiveTemplate(templateName);
  };
  
  const handleFormChange = (newConfig: YamlConfig) => {
    setConfig(newConfig);
    setActiveTemplate('custom');
  }

  const handleWorkloadDescriptorChange = (newDescriptor: WorkloadDescriptor) => {
    setWorkloadDescriptor(newDescriptor);
    setActiveTemplate('custom');
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
            <h2 className="text-lg font-headline font-semibold mb-2">Start with a Template</h2>
            <div className="flex flex-wrap gap-2">
                {Object.keys(templates).map((key) => {
                    const templateName = key as TemplateName;
                    return (
                        <Button
                            key={templateName}
                            variant={activeTemplate === templateName ? 'default' : 'outline'}
                            onClick={() => handleTemplateSelect(templateName)}
                        >
                            {templateName.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                        </Button>
                    );
                })}
            </div>
        </div>
        <Separator className="my-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <YamlForm 
            config={config} 
            setConfig={handleFormChange} 
            workloadDescriptor={workloadDescriptor}
            setWorkloadDescriptor={handleWorkloadDescriptorChange}
          />
          <YamlPreview 
            generatedYaml={yamlString} 
            workloadDescriptorYaml={config.build.enabled ? workloadDescriptorYamlString : undefined}
          />
        </div>
      </main>
    </div>
  );
}
