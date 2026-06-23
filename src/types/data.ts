export type MonthlyRate = {
  month: string;
  approvalRatePct: number;
};

export type SegmentRate = {
  segment: string;
  approvalRatePct: number;
};

export type PortfolioPoint = {
  month: string;
  portfolioValue: number;
};

export type FraudMonthly = {
  month: string;
  incidents: number;
  lossAmount: number;
};

export type FraudByType = {
  type: string;
  incidents: number;
  sharePct: number;
};

export type FraudByChannel = {
  channel: string;
  incidents: number;
  avgLossPerIncident: number;
};

export type DashboardData = {
  metadata: {
    dashboardTitle: string;
    asOfDate: string;
    currency: string;
    period: string;
    generatedFor: string;
  };
  loanApprovalRates: {
    overall: MonthlyRate[];
    byDemographics: {
      householdIncome: SegmentRate[];
      educationLevel: SegmentRate[];
      age: SegmentRate[];
    };
  };
  portfolioPerformance: PortfolioPoint[];
  fraudPatterns: {
    monthlyIncidents: FraudMonthly[];
    byType: FraudByType[];
    byChannel: FraudByChannel[];
  };
};
