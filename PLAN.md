## Interactive Dashboard

# Brief
A simple analytics dashboard showing meaningful data trends for a banking professional. The data must be well-organized and labeled clearly so that the banking professional can deduce meaningful insights.

# Data
Create a fake, but realistic data set for a dashboard that meaningfully shows data trends. This is a dashboard for a banking professional. Users should be able to see:
- Loan approval rates (percentage)
- Loan approval rates sorted by demographics (household income, education level, age)
- Portfolio performance over time (quantity in dollars that trend upward, but sometimes have instability)
- Fraud patterns

# Layout
- Side navigation with tabs for Loans, Portfolio and Fraud
- In each tab, show 3 columns for charts and graphs to display the appropriate information for each
    - Loan should show average key metrics in the first column and loan approval rates across the difference demographics columns two and three
    - Portfolio should show average key metrics across all groups in the first column and portfolio performance filtered by the difference demographics in columns two and three
    - Fraud should show possible fraud alerts in the first column and fraud rates and number of instances in columns two and three

# Interactions
When clicking on the tabs in the side navigation, the dashboard should change to show that information. It should visually look like a different page on the same site.

# Style
Use vue 3 and vuetify and their standard material design library. It should be a light mode palette. It should be simple and clean and well-labeled. It should follow WCAG acccessibility guidelines.

# Tech
- vue 3, typescript and vuetify
- chart.js via vuecharts for all charts and graphs
- fake data from JSON file