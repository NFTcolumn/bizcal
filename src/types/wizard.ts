export interface WizardData {
    productionCost: number;     // Material cost per unit
    productionTime: number;     // Hours/mins to make one unit
    shippingCost: number;       // Cost to ship one unit
    weeklyWorkHours: number;    // Hours willing to work per week
    yearlyIncomeGoal: number;   // Target annual profit
    leadsPerSale: number;       // Number of offers/convos to get 1 sale
    timePerLead: number;        // Total time spent per lead/offer in hours
    unitPrice: number;          // Current price
    targetVolume: number;       // Annual units planned (adjustable lever)
}

export interface GoalBreakdown {
    period: string;
    unitsPlanned: number;       // Units from volume slider
    leadsNeeded: number;        // unitsPlanned * leadsPerSale
    hoursNeeded: number;        // unitsPlanned * totalTimePerUnit
    projectedProfit: number;    // profit from planned units
    targetProfit: number;       // The static goal profit
}
