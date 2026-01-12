import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onGenerateSample: () => void;
  isLoading: boolean;
}

const FileUpload = ({ onFileUpload, onGenerateSample, isLoading }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      setFileName(file.name);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setFileName(file.name);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <div className="animate-slide-up stagger-1">
      <div className="glass-card rounded-2xl p-8 transition-theme">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload Transaction Data
        </h2>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer group ${
            isDragging
              ? 'border-primary bg-primary/5 glow-primary'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />
          
          <div className="text-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 gradient-primary rounded-full blur-lg opacity-50 animate-pulse" />
                  <div className="relative gradient-primary p-4 rounded-full">
                    <Loader2 className="h-8 w-8 text-primary-foreground animate-spin" />
                  </div>
                </div>
                <p className="text-lg font-medium text-foreground">Analyzing transactions...</p>
                <p className="text-sm text-muted-foreground">Please wait while we detect fraud patterns</p>
              </div>
            ) : (
              <>
                <div className={`inline-block p-4 rounded-full mb-4 transition-all duration-300 ${
                  isDragging ? 'gradient-primary scale-110' : 'bg-muted group-hover:bg-primary/10'
                }`}>
                  <FileSpreadsheet className={`h-8 w-8 transition-colors ${
                    isDragging ? 'text-primary-foreground' : 'text-primary'
                  }`} />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">
                  {fileName || 'Drop your CSV file here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-sm text-muted-foreground">or</span>
          <Button
            onClick={onGenerateSample}
            disabled={isLoading}
            className="gradient-accent text-accent-foreground font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 group"
          >
            <Sparkles className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            Generate Sample Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
