'use client';

import { useState, useEffect } from 'react';
import { type YamlConfig, type TemplateName } from '@/lib/definitions';
import { generateYaml } from '@/lib/yaml-generator';
import { YamlForm } from '@/components/yaml-form';
import { YamlPreview } from '@/components/yaml-preview';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { initialConfig, templates } from '@/lib/templates';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [config, setConfig] = useState<YamlConfig>(initialConfig);
  const [yamlString, setYamlString] = useState('');
  const [activeTemplate, setActiveTemplate] = useState<TemplateName | 'custom'>('service-build-from-source');

  useEffect(() => {
    const newYaml = generateYaml(config);
    setYamlString(newYaml);
  }, [config]);

  const handleTemplateSelect = (templateName: TemplateName) => {
    setConfig(templates[templateName]);
    setActiveTemplate(templateName);
  };
  
  const handleFormChange = (newConfig: YamlConfig) => {
    setConfig(newConfig);
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
          <YamlForm config={config} setConfig={handleFormChange} />
          <YamlPreview generatedYaml={yamlString} />
        </div>
      </main>
    </div>
  );
}
