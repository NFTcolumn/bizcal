export interface WizardData {
    productionCost: number;     // Material cost per unit
    productionTime: number;     // Hours to make one unit
    shippingCost: number;       // Cost to ship one unit
    desiredHourlyRate: number;  // Target $/hr
    weeklyWorkHours: number;    // Hours willing to work per week
    yearlyIncomeGoal: number;   // Target annual profit
    leadsPerSale: number;       // Number of offers/convos to get 1 sale
    timePerLead: number;        // Total time spent per lead/offer in hours
    unitPrice: number;          // Current price (adjustable via slider)
}

export interface GoalBreakdown {
    period: string;
    units: number;
    hours: number;
    revenue: number;
    profit: number;
}
