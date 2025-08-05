'use client';

import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, Copy, Lightbulb, Loader2, Check } from 'lucide-react';
import { getSuggestions } from '@/app/actions';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function YamlPreview({ generatedYaml }: { generatedYaml: string }) {
  const [editorContent, setEditorContent] = useState(generatedYaml);
  const [isCopied, setIsCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setEditorContent(generatedYaml);
  }, [generatedYaml]);

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
    a.download = 'config.yml';
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

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="font-headline">Generated YAML</CardTitle>
        <CardDescription>Preview, edit, and download your YAML file.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ScrollArea className="h-[75vh] w-full rounded-md border whitespace-nowrap">
            <Textarea
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              className="min-h-full w-full font-code text-sm !border-0 !ring-0 focus:!ring-offset-0 focus-visible:!ring-0 resize-none"
              placeholder="Your YAML will appear here..."
            />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        {suggestions.length > 0 && (
             <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Suggestions</h4>
                <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                        <Button key={i} variant="outline" size="sm" onClick={() => applySuggestion(s)}>
                            {s.split('\n')[0]}...
                        </Button>
                    ))}
                </div>
            </div>
        )}
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
