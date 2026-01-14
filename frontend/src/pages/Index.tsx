import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ParticleBackground from '@/components/ParticleBackground';
import Header from '@/components/Header';
import WelcomeScreen from '@/components/WelcomeScreen';
import FileUpload from '@/components/FileUpload';
import StatisticsCards from '@/components/StatisticsCards';
import ChartsSection from '@/components/ChartsSection';
import TransactionTable from '@/components/TransactionTable';
import { analyzeFile, getSampleData, generateMockData, AnalysisResult } from '../lib/api';

const Index = () => {
  const [isDark, setIsDark] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleStart = () => {
    setShowWelcome(false);
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const result = await analyzeFile(file);
      setAnalysisResult(result);
      toast.success('Analysis complete!', {
        description: `Found ${result.statistics.suspiciousCount} suspicious transactions.`,
      });
    } catch (error) {
      // Fallback to mock data if API is not available
      console.warn('API not available, using mock data');
      const mockResult = generateMockData();
      setAnalysisResult(mockResult);
      toast.success('Analysis complete! (Demo mode)', {
        description: `Found ${mockResult.statistics.suspiciousCount} suspicious transactions.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSample = async () => {
    setIsLoading(true);
    try {
      const result = await getSampleData();
      setAnalysisResult(result);
      toast.success('Sample data generated!', {
        description: `Analyzing ${result.statistics.totalTransactions} transactions.`,
      });
    } catch (error) {
      // Fallback to mock data if API is not available
      console.warn('API not available, using mock data');
      const mockResult = generateMockData();
      setAnalysisResult(mockResult);
      toast.success('Sample data generated! (Demo mode)', {
        description: `Analyzing ${mockResult.statistics.totalTransactions} transactions.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen transition-theme">
        <ParticleBackground />
        <WelcomeScreen onStart={handleStart} />
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-theme">
      <ParticleBackground />
      <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <FileUpload
            onFileUpload={handleFileUpload}
            onGenerateSample={handleGenerateSample}
            isLoading={isLoading}
          />

          {analysisResult && (
            <>
              <StatisticsCards statistics={analysisResult.statistics} />
              
              <ChartsSection
                riskDistribution={analysisResult.riskDistribution}
                fraudComparison={analysisResult.fraudComparison}
              />
              
              <TransactionTable transactions={analysisResult.transactions} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
