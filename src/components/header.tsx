import { FileJson2 } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
           <FileJson2 className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-headline font-bold text-primary/90">
          YAMLForge
        </h1>
      </div>
      <p className="text-sm text-muted-foreground hidden md:block">
        Generate OpenChoreo YAML with AI assistance
      </p>
    </header>
  );
}
