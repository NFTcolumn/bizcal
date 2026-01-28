export interface WizardData {
    productionCost: number;     // Material cost per unit
    productionTime: number;     // Hours/mins to make one unit
    shippingCost: number;       // Cost to ship one unit
    weeklyWorkHours: number;    // Hours willing to work per week
    yearlyIncomeGoal: number;   // Target annual profit
    leadsPerSale: number;       // Number of offers/convos to get 1 sale
    timePerLead: number;        // Total time spent per lead/offer in hours
    unitPrice: number;          // Current price
}

export interface GoalBreakdown {
    period: string;
    unitsNeeded: number;        // Units needed for GOAL
    maxUnits: number;           // Units possible in capacity
    hoursNeeded: number;
    actualProfit: number;       // Profit at capacity
    targetProfit: number;       // The goal profit
}
