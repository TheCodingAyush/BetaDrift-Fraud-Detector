import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export interface Transaction {
  id: string;
  amount: number;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  reasons: string[];
}

export interface AnalysisResult {
  transactions: Transaction[];
  statistics: {
    totalTransactions: number;
    suspiciousCount: number;
    fraudRate: number;
    totalAtRisk: number;
  };
  riskDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  fraudComparison: Array<{
    name: string;
    fraudulent: number;
    normal: number;
  }>;
}

export const analyzeFile = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getSampleData = async (): Promise<AnalysisResult> => {
  const response = await axios.get(`${API_BASE_URL}/sample-data`);
  return response.data;
};

// Mock data for demo purposes when API is not available
export const generateMockData = (): AnalysisResult => {
  const riskLevels: Array<'Low' | 'Medium' | 'High' | 'Critical'> = ['Low', 'Medium', 'High', 'Critical'];
  const reasonsList = [
    'Unusual transaction pattern',
    'High amount deviation',
    'Multiple rapid transactions',
    'Geographic anomaly',
    'New merchant category',
    'Time-based anomaly',
    'Velocity check failed',
    'Device fingerprint mismatch',
    'IP address suspicious',
    'Account behavior change',
  ];

  const transactions: Transaction[] = Array.from({ length: 150 }, (_, i) => {
    const riskScore = Math.floor(Math.random() * 100);
    const riskLevel = riskScore >= 80 ? 'Critical' : 
                      riskScore >= 60 ? 'High' : 
                      riskScore >= 40 ? 'Medium' : 'Low';
    
    const numReasons = Math.floor(Math.random() * 4) + 1;
    const reasons = Array.from({ length: numReasons }, () => 
      reasonsList[Math.floor(Math.random() * reasonsList.length)]
    ).filter((v, i, a) => a.indexOf(v) === i);

    return {
      id: `TXN-${String(i + 1001).padStart(6, '0')}`,
      amount: Math.floor(Math.random() * 50000) + 100,
      riskScore,
      riskLevel,
      reasons,
    };
  });

  const lowCount = transactions.filter(t => t.riskLevel === 'Low').length;
  const mediumCount = transactions.filter(t => t.riskLevel === 'Medium').length;
  const highCount = transactions.filter(t => t.riskLevel === 'High').length;
  const criticalCount = transactions.filter(t => t.riskLevel === 'Critical').length;
  const suspiciousCount = mediumCount + highCount + criticalCount;
  const totalAtRisk = transactions
    .filter(t => t.riskLevel !== 'Low')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    transactions,
    statistics: {
      totalTransactions: transactions.length,
      suspiciousCount,
      fraudRate: (suspiciousCount / transactions.length) * 100,
      totalAtRisk,
    },
    riskDistribution: [
      { name: 'Low', value: lowCount, color: 'hsl(150 70% 45%)' },
      { name: 'Medium', value: mediumCount, color: 'hsl(40 95% 55%)' },
      { name: 'High', value: highCount, color: 'hsl(25 95% 55%)' },
      { name: 'Critical', value: criticalCount, color: 'hsl(0 85% 55%)' },
    ],
    fraudComparison: [
      { name: 'Q1', fraudulent: Math.floor(suspiciousCount * 0.2), normal: Math.floor(lowCount * 0.25) },
      { name: 'Q2', fraudulent: Math.floor(suspiciousCount * 0.3), normal: Math.floor(lowCount * 0.3) },
      { name: 'Q3', fraudulent: Math.floor(suspiciousCount * 0.25), normal: Math.floor(lowCount * 0.25) },
      { name: 'Q4', fraudulent: Math.floor(suspiciousCount * 0.25), normal: Math.floor(lowCount * 0.2) },
    ],
  };
};
