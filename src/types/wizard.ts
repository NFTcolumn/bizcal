export interface WizardData {
    productionCost: number;     // Material cost per unit
    productionTime: number;     // Hours/mins to make one unit
    shippingCost: number;       // Cost to ship one unit
    weeklyWorkHours: number;    // Hours willing to work per week
    yearlyIncomeGoal: number;   // Target annual profit
    leadsPerSale: number;       // e.g. 100 people contacted to get 1 sale
    prospectingTimeMinutes: number; // e.g. 5 minutes per lead contact
    closingMeetingTimeHours: number; // e.g. 3 hours for the final meeting
    unitPrice: number;          // Current price
    targetVolume: number;       // Annual units planned
}

export interface GoalBreakdown {
    period: string;
    unitsPlanned: number;       // Units from volume slider
    leadsNeeded: number;        // unitsPlanned * leadsPerSale
    hoursNeeded: number;        // Production + Prospecting + Closing
    projectedProfit: number;    // profit from planned units
    targetProfit: number;       // The static goal profit
}
