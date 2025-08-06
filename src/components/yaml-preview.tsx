'use client';

import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, Copy, Lightbulb, Loader2, Check } from 'lucide-react';
import { getSuggestions } from '@/app/actions';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface YamlPreviewProps {
  generatedYaml: string;
  workloadDescriptorYaml?: string;
}

export function YamlPreview({ generatedYaml, workloadDescriptorYaml }: YamlPreviewProps) {
  const [activeTab, setActiveTab] = useState("component");
  const [editorContent, setEditorContent] = useState(generatedYaml);
  const [isCopied, setIsCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'component') {
      setEditorContent(generatedYaml);
    } else if (activeTab === 'workload' && workloadDescriptorYaml) {
      setEditorContent(workloadDescriptorYaml);
    }
  }, [generatedYaml, workloadDescriptorYaml, activeTab]);

  useEffect(() => {
    if(workloadDescriptorYaml === undefined && activeTab === 'workload') {
      setActiveTab('component');
    }
  }, [workloadDescriptorYaml, activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editorContent);
    setIsCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([editorContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab === 'component' ? 'component.yaml' : 'workload.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGetSuggestions = () => {
    startTransition(async () => {
      setSuggestions([]);
      const result = await getSuggestions({
        context: editorContent,
        userInput: "Suggest next valid YAML lines based on the context",
      });
      if (result && result.suggestions) {
        setSuggestions(result.suggestions);
        if(result.suggestions.length === 0) {
            toast({ title: 'AI Assistant', description: 'No suggestions found at this time.' });
        }
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch AI suggestions.' });
      }
    });
  };
  
  const applySuggestion = (suggestion: string) => {
    setEditorContent(prev => prev.trim() + '\n' + suggestion);
    setSuggestions([]);
  }

  const PreviewArea = ({value}: {value: string}) => (
     <div className="relative">
        <ScrollArea className="h-[50vh] w-full rounded-md border">
          <Textarea
            value={value}
            onChange={(e) => setEditorContent(e.target.value)}
            className="min-h-full w-full font-code text-sm !border-0 !ring-0 focus:!ring-offset-0 focus-visible:!ring-0 resize-none whitespace-pre"
            placeholder="Your YAML will appear here..."
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
  )

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="font-headline">Generated YAML</CardTitle>
        <CardDescription>Preview, edit, and download your YAML file.</CardDescription>
      </CardHeader>
      <CardContent>
       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
            <TabsTrigger value="component">Component</TabsTrigger>
            {workloadDescriptorYaml && <TabsTrigger value="workload">Workload</TabsTrigger>}
        </TabsList>
        <TabsContent value="component">
            <PreviewArea value={editorContent} />
        </TabsContent>
        {workloadDescriptorYaml && 
            <TabsContent value="workload">
                 <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                    Commit this <code className="font-code bg-blue-100 px-1 rounded">workload.yaml</code> file to the root of your service directory.
                </div>
                <div className="mt-4">
                    <PreviewArea value={editorContent} />
                </div>
            </TabsContent>
        }
       </Tabs>
      </CardContent>
      <CardFooter className="flex-wrap gap-2 justify-end">
        <Button variant="outline" onClick={handleCopy}>
          {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          Copy
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button onClick={handleGetSuggestions} disabled={isPending} className="bg-accent hover:bg-accent/90">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          AI Suggest
        </Button>
      </CardFooter>
    </Card>
  );
}
