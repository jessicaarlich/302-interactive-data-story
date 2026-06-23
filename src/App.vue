<script setup lang="ts">
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { Bar, Doughnut, Line } from "vue-chartjs";
import { useDashboardData } from "./composables/useDashboardData";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
);

type DashboardView = "loans" | "portfolio" | "fraud";

const { data, loan, portfolio, fraud, helpers } = useDashboardData();
const currentView = ref<DashboardView>("loans");
const drawerOpen = ref(false);
const { mdAndDown } = useDisplay();

const isCompactLayout = computed(() => mdAndDown.value);

const currentViewLabel = computed(
  () => navItems.find((item) => item.value === currentView.value)?.label ?? "Dashboard"
);

const selectView = (view: DashboardView) => {
  currentView.value = view;
  if (isCompactLayout.value) {
    drawerOpen.value = false;
  }
};

const navItems: { label: string; value: DashboardView; icon: string }[] = [
  { label: "Loans", value: "loans", icon: "mdi-cash-multiple" },
  { label: "Portfolio", value: "portfolio", icon: "mdi-chart-line" },
  { label: "Fraud", value: "fraud", icon: "mdi-shield-alert" }
];

const sharedBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: string | number) => `${value}%`
      }
    }
  }
};

const sharedLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom" as const
    }
  }
};

const loanTrendData = computed(() => ({
  labels: loan.monthly.map((row) => row.month),
  datasets: [
    {
      label: "Approval Rate",
      data: loan.monthly.map((row) => row.approvalRatePct),
      borderColor: "#1a7f64",
      backgroundColor: "rgba(26, 127, 100, 0.15)",
      fill: true,
      tension: 0.35,
      pointRadius: 2
    }
  ]
}));

const incomeChartData = computed(() => ({
  labels: loan.byIncome.map((row) => row.segment),
  datasets: [
    {
      label: "Income Segment Approval %",
      data: loan.byIncome.map((row) => row.approvalRatePct),
      backgroundColor: ["#d56a35", "#d28a1a", "#2d5f98", "#1a7f64"]
    }
  ]
}));

const educationChartData = computed(() => ({
  labels: loan.byEducation.map((row) => row.segment),
  datasets: [
    {
      label: "Education Approval %",
      data: loan.byEducation.map((row) => row.approvalRatePct),
      backgroundColor: ["#f0c26b", "#95b5d7", "#6fa58f", "#326f60"]
    }
  ]
}));

const ageChartData = computed(() => ({
  labels: loan.byAge.map((row) => row.segment),
  datasets: [
    {
      label: "Age Group Approval %",
      data: loan.byAge.map((row) => row.approvalRatePct),
      backgroundColor: "#2d5f98"
    }
  ]
}));

const portfolioLineData = computed(() => ({
  labels: portfolio.monthly.map((row) => row.month),
  datasets: [
    {
      label: "Portfolio Value",
      data: portfolio.monthly.map((row) => row.portfolioValue),
      borderColor: "#2d5f98",
      backgroundColor: "rgba(45, 95, 152, 0.13)",
      fill: true,
      tension: 0.3
    }
  ]
}));

const portfolioByIncomeData = computed(() => ({
  labels: portfolio.monthly.map((row) => row.month),
  datasets: portfolio.byIncome.map((series, idx) => ({
    label: series.segment,
    data: series.values.map((point) => point.value),
    borderColor: ["#b7651f", "#d28a1a", "#2d5f98", "#1a7f64"][idx % 4],
    tension: 0.3
  }))
}));

const portfolioByAgeData = computed(() => ({
  labels: portfolio.monthly.map((row) => row.month),
  datasets: portfolio.byAge.map((series, idx) => ({
    label: series.segment,
    data: series.values.map((point) => point.value),
    borderColor: ["#326f60", "#2d5f98", "#d28a1a", "#1a7f64", "#b7651f", "#5f7288"][
      idx % 6
    ],
    tension: 0.25
  }))
}));

const fraudMonthlyData = computed(() => ({
  labels: fraud.monthly.map((row) => row.month),
  datasets: [
    {
      label: "Incidents",
      data: fraud.monthly.map((row) => row.incidents),
      borderColor: "#b12a2a",
      backgroundColor: "rgba(177, 42, 42, 0.15)",
      yAxisID: "y",
      tension: 0.3
    },
    {
      label: "Loss Amount",
      data: fraud.monthly.map((row) => row.lossAmount),
      borderColor: "#2d5f98",
      backgroundColor: "rgba(45, 95, 152, 0.15)",
      yAxisID: "y1",
      tension: 0.3
    }
  ]
}));

const fraudMonthlyOptions = {
  ...sharedLineOptions,
  scales: {
    y: {
      type: "linear" as const,
      position: "left" as const,
      beginAtZero: true,
      title: { display: true, text: "Incidents" }
    },
    y1: {
      type: "linear" as const,
      position: "right" as const,
      beginAtZero: true,
      grid: { drawOnChartArea: false },
      ticks: {
        callback: (value: string | number) => `$${Number(value).toLocaleString()}`
      },
      title: { display: true, text: "Loss (USD)" }
    }
  }
};

const fraudTypeData = computed(() => ({
  labels: fraud.byType.map((row) => row.type),
  datasets: [
    {
      data: fraud.byType.map((row) => row.incidents),
      backgroundColor: ["#b12a2a", "#d56a35", "#d28a1a", "#2d5f98", "#1a7f64"]
    }
  ]
}));

const fraudChannelData = computed(() => ({
  labels: fraud.byChannel.map((row) => row.channel),
  datasets: [
    {
      label: "Incidents",
      data: fraud.byChannel.map((row) => row.incidents),
      backgroundColor: "#2d5f98"
    }
  ]
}));

const fraudChannelOptions = {
  ...sharedBarOptions,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

const moneyAxisOptions = {
  ...sharedLineOptions,
  scales: {
    y: {
      ticks: {
        callback: (value: string | number) => `$${Math.round(Number(value) / 1000000)}M`
      }
    }
  }
};
</script>

<template>
  <v-app>
    <v-layout class="dashboard-shell">
      <v-navigation-drawer
        v-model="drawerOpen"
        :width="272"
        color="surface"
        class="dashboard-nav"
        elevation="2"
        :permanent="!isCompactLayout"
        :temporary="isCompactLayout"
      >
        <div class="brand-block">
          <h1>BankScope</h1>
          <p>Interactive Banking Story</p>
        </div>

        <v-list nav density="comfortable" aria-label="Dashboard sections">
          <v-list-item
            v-for="item in navItems"
            :key="item.value"
            :active="currentView === item.value"
            :prepend-icon="item.icon"
            :title="item.label"
            rounded="lg"
            @click="selectView(item.value)"
          />
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-app-bar
          v-if="isCompactLayout"
          color="surface"
          density="comfortable"
          elevation="1"
          class="mobile-topbar"
        >
          <v-btn
            icon="mdi-menu"
            variant="text"
            aria-label="Open navigation menu"
            @click="drawerOpen = !drawerOpen"
          />
          <v-toolbar-title>{{ currentViewLabel }}</v-toolbar-title>
        </v-app-bar>

        <v-container fluid class="pa-6">
          <section class="header-panel reveal-card">
            <div>
              <h2>{{ data.metadata.dashboardTitle }}</h2>
              <p>
                As of {{ data.metadata.asOfDate }} | Currency: {{ data.metadata.currency }}
              </p>
            </div>
            <v-chip color="primary" variant="flat" size="large">
              {{ data.metadata.generatedFor }}
            </v-chip>
          </section>

          <v-window v-model="currentView" class="mt-4" :touch="false">
            <v-window-item value="loans">
              <v-row>
                <v-col cols="12" md="4">
                  <v-card class="metric-card reveal-card" elevation="1">
                    <h3>Current Approval Rate</h3>
                    <p class="metric">{{ loan.latestApproval.toFixed(1) }}%</p>
                  </v-card>
                  <v-card class="metric-card reveal-card delay-1" elevation="1">
                    <h3>18-Month Change</h3>
                    <p class="metric">{{ loan.trendDeltaPct.toFixed(1) }}%</p>
                  </v-card>
                  <v-card class="metric-card reveal-card delay-2" elevation="1">
                    <h3>Strongest Segment</h3>
                    <p class="metric">
                      {{ loan.byIncome[loan.byIncome.length - 1].segment }}
                    </p>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card class="chart-card reveal-card" elevation="1">
                    <h3>Approval by Household Income</h3>
                    <div class="chart-wrap">
                      <Bar :data="incomeChartData" :options="sharedBarOptions" />
                    </div>
                  </v-card>
                  <v-card class="chart-card reveal-card delay-1" elevation="1">
                    <h3>Approval by Education Level</h3>
                    <div class="chart-wrap">
                      <Bar :data="educationChartData" :options="sharedBarOptions" />
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card class="chart-card reveal-card" elevation="1">
                    <h3>Approval by Age Group</h3>
                    <div class="chart-wrap">
                      <Bar :data="ageChartData" :options="sharedBarOptions" />
                    </div>
                  </v-card>
                  <v-card class="chart-card reveal-card delay-1" elevation="1">
                    <h3>Monthly Approval Trend</h3>
                    <div class="chart-wrap">
                      <Line :data="loanTrendData" :options="sharedLineOptions" />
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item value="portfolio">
              <v-row>
                <v-col cols="12" md="4">
                  <v-card class="metric-card reveal-card" elevation="1">
                    <h3>Current Portfolio Value</h3>
                    <p class="metric">{{ helpers.formatMoney(portfolio.latestValue) }}</p>
                  </v-card>
                  <v-card class="metric-card reveal-card delay-1" elevation="1">
                    <h3>Total Growth</h3>
                    <p class="metric">{{ portfolio.growthPct.toFixed(1) }}%</p>
                  </v-card>
                  <v-card class="metric-card reveal-card delay-2" elevation="1">
                    <h3>Recent Volatility</h3>
                    <p class="metric">Moderate</p>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card class="chart-card reveal-card" elevation="1">
                    <h3>Overall Portfolio Performance</h3>
                    <div class="chart-wrap">
                      <Line :data="portfolioLineData" :options="moneyAxisOptions" />
                    </div>
                  </v-card>
                  <v-card class="chart-card reveal-card delay-1" elevation="1">
                    <h3>Portfolio by Income Segment</h3>
                    <div class="chart-wrap">
                      <Line :data="portfolioByIncomeData" :options="moneyAxisOptions" />
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card class="chart-card reveal-card" elevation="1">
                    <h3>Portfolio by Age Segment</h3>
                    <div class="chart-wrap">
                      <Line :data="portfolioByAgeData" :options="moneyAxisOptions" />
                    </div>
                  </v-card>
                  <v-card class="chart-card reveal-card delay-1" elevation="1">
                    <h3>Stability Notes</h3>
                    <p class="body-copy">
                      The long-term trend is upward, with expected short-term drawdowns in mid-year
                      cycles. Segment curves highlight uneven growth behavior across customer bands.
                    </p>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item value="fraud">
              <v-row>
                <v-col cols="12" md="4">
                  <v-card class="metric-card reveal-card" elevation="1">
                    <h3>Latest Monthly Incidents</h3>
                    <p class="metric">{{ fraud.latestIncidents }}</p>
                  </v-card>
                  <v-card class="metric-card reveal-card delay-1" elevation="1">
                    <h3>Latest Monthly Loss</h3>
                    <p class="metric">{{ helpers.formatMoney(fraud.latestLoss) }}</p>
                  </v-card>
                  <v-card class="metric-card reveal-card delay-2" elevation="1">
                    <h3>Possible Fraud Alerts</h3>
                    <v-list density="compact" class="alert-list">
                      <v-list-item
                        v-for="alert in fraud.alerts"
                        :key="alert"
                        prepend-icon="mdi-alert-outline"
                        :title="alert"
                      />
                    </v-list>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card class="chart-card reveal-card" elevation="1">
                    <h3>Fraud Rate and Loss Patterns</h3>
                    <div class="chart-wrap">
                      <Line :data="fraudMonthlyData" :options="fraudMonthlyOptions" />
                    </div>
                  </v-card>
                  <v-card class="chart-card reveal-card delay-1" elevation="1">
                    <h3>Top Fraud Type</h3>
                    <p class="body-copy">
                      {{ fraud.topType }} is currently the highest-volume pattern. Largest month-to-month
                      spike is +{{ fraud.maxSpike }} incidents.
                    </p>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card class="chart-card reveal-card" elevation="1">
                    <h3>Fraud Incidents by Type</h3>
                    <div class="chart-wrap">
                      <Doughnut :data="fraudTypeData" :options="sharedLineOptions" />
                    </div>
                  </v-card>
                  <v-card class="chart-card reveal-card delay-1" elevation="1">
                    <h3>Fraud Incidents by Channel</h3>
                    <div class="chart-wrap">
                      <Bar :data="fraudChannelData" :options="fraudChannelOptions" />
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>
