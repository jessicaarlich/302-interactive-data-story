import rawData from "../data/banking-dashboard-data.json";
import type {
  DashboardData,
  FraudMonthly,
  PortfolioPoint,
  SegmentRate
} from "../types/data";

const data = rawData as DashboardData;

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);

const pctDelta = (start: number, end: number) => ((end - start) / start) * 100;

const calcMaxFraudSpike = (monthly: FraudMonthly[]) => {
  if (monthly.length < 2) return 0;

  let maxSpike = 0;
  for (let i = 1; i < monthly.length; i += 1) {
    const spike = monthly[i].incidents - monthly[i - 1].incidents;
    if (spike > maxSpike) maxSpike = spike;
  }

  return maxSpike;
};

const buildSegmentPortfolio = (
  base: PortfolioPoint[],
  segments: SegmentRate[],
  multiplierFloor: number,
  multiplierStep: number
) => {
  return segments.map((segment, segmentIndex) => {
    const multiplier = multiplierFloor + segmentIndex * multiplierStep;
    return {
      segment: segment.segment,
      values: base.map((point, pointIndex) => {
        const wave = (pointIndex % 4) * 0.008;
        const value = point.portfolioValue * (multiplier + wave);
        return {
          month: point.month,
          value: Math.round(value)
        };
      })
    };
  });
};

export const useDashboardData = () => {
  const approvalOverall = data.loanApprovalRates.overall;
  const latestApproval = approvalOverall[approvalOverall.length - 1]?.approvalRatePct ?? 0;
  const firstApproval = approvalOverall[0]?.approvalRatePct ?? 0;

  const portfolio = data.portfolioPerformance;
  const latestPortfolio = portfolio[portfolio.length - 1]?.portfolioValue ?? 0;
  const firstPortfolio = portfolio[0]?.portfolioValue ?? 0;

  const fraudMonthly = data.fraudPatterns.monthlyIncidents;
  const latestFraud = fraudMonthly[fraudMonthly.length - 1] ?? {
    month: "N/A",
    incidents: 0,
    lossAmount: 0
  };

  const topFraudType = [...data.fraudPatterns.byType].sort(
    (a, b) => b.incidents - a.incidents
  )[0];

  return {
    data,
    helpers: {
      formatMoney
    },
    loan: {
      trendDeltaPct: pctDelta(firstApproval, latestApproval),
      latestApproval,
      byIncome: data.loanApprovalRates.byDemographics.householdIncome,
      byEducation: data.loanApprovalRates.byDemographics.educationLevel,
      byAge: data.loanApprovalRates.byDemographics.age,
      monthly: approvalOverall
    },
    portfolio: {
      latestValue: latestPortfolio,
      growthPct: pctDelta(firstPortfolio, latestPortfolio),
      monthly: portfolio,
      byIncome: buildSegmentPortfolio(
        portfolio,
        data.loanApprovalRates.byDemographics.householdIncome,
        0.2,
        0.11
      ),
      byAge: buildSegmentPortfolio(
        portfolio,
        data.loanApprovalRates.byDemographics.age,
        0.12,
        0.08
      )
    },
    fraud: {
      monthly: fraudMonthly,
      byType: data.fraudPatterns.byType,
      byChannel: data.fraudPatterns.byChannel,
      latestIncidents: latestFraud.incidents,
      latestLoss: latestFraud.lossAmount,
      maxSpike: calcMaxFraudSpike(fraudMonthly),
      topType: topFraudType?.type ?? "N/A",
      alerts: [
        `Highest risk vector: ${topFraudType?.type ?? "Unknown"}`,
        `Largest monthly incident jump: +${calcMaxFraudSpike(fraudMonthly)} cases`,
        `Current monthly loss exposure: ${formatMoney(latestFraud.lossAmount)}`
      ]
    }
  };
};
