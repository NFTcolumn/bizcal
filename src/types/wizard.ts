export interface WizardData {
    productionCost: number;     // Material cost per unit
    productionTime: number;     // Hours/mins to make one unit
    shippingCost: number;       // Cost to ship one unit
    weeklyWorkHours: number;    // Hours willing to work per week
    yearlyIncomeGoal: number;   // Target annual profit

    // Funnel Stage 1: Prospecting
    rawLeadsPerQualified: number;   // e.g. 10 people to find 1 qualified
    prospectingTimeMinutes: number; // e.g. 5 minutes for first touch

    // Funnel Stage 2: Qualification
    qualifiedPerSale: number;       // e.g. 5 qualified to get 1 sale
    qualificationTimeMinutes: number; // e.g. 15 minutes to screen

    // Funnel Stage 3: Conversion
    closingMeetingTimeHours: number; // e.g. 3 hours for the final meeting

    unitPrice: number;          // Current price
    targetVolume: number;       // Annual units planned
}

export interface GoalBreakdown {
    period: string;
    unitsPlanned: number;
    rawLeadsNeeded: number;
    qualifiedLeadsNeeded: number;
    hoursNeeded: number;
    projectedProfit: number;
    targetProfit: number;
}
