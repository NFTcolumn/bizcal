import type { WizardData, GoalBreakdown } from '../types/wizard';

export const calculateWizardMetrics = (data: WizardData) => {
    // Variable Costs
    const variableCostPerUnit = data.productionCost + data.shippingCost;

    // Funnel Math:
    // Total Leads per Sale = rawLeadsPerQualified * qualifiedPerSale
    const rawLeadsPerSale = data.rawLeadsPerQualified * data.qualifiedPerSale;

    // Time breakdown per Sale:
    const prospectingHoursPerSale = (rawLeadsPerSale * data.prospectingTimeMinutes) / 60;
    const qualificationHoursPerSale = (data.qualifiedPerSale * data.qualificationTimeMinutes) / 60;
    const closingHoursPerSale = data.closingMeetingTimeHours;

    const totalSalesTimePerSale = prospectingHoursPerSale + qualificationHoursPerSale + closingHoursPerSale;
    const totalTimePerUnit = data.productionTime + totalSalesTimePerSale;

    // Determine max capacity based on time
    const totalUnitsAtCapacity = (data.weeklyWorkHours * 52) / (totalTimePerUnit || 1);
    const unitsPerWeek = totalUnitsAtCapacity / 52;

    // Calculate price needed to hit goal at that capacity
    const requiredProfitPerUnit = data.yearlyIncomeGoal / (totalUnitsAtCapacity || 1);
    const recommendedPrice = requiredProfitPerUnit + variableCostPerUnit;

    // Now use this derived pricing for the breakdown (assuming user hits capacity)
    const currentPrice = data.unitPrice || recommendedPrice;
    const unitProfit = currentPrice - variableCostPerUnit;

    const calculateForPeriod = (period: string, factor: number): GoalBreakdown => {
        const unitsPlanned = unitsPerWeek * (52 / factor);
        const rawLeadsNeeded = unitsPlanned * rawLeadsPerSale;
        const qualifiedLeadsNeeded = unitsPlanned * data.qualifiedPerSale; // Fix for lint: using data.qualifiedPerSale elsewhere
        const hoursNeeded = unitsPlanned * totalTimePerUnit;
        const projectedProfit = unitsPlanned * unitProfit;

        return {
            period,
            unitsPlanned: Number(unitsPlanned.toFixed(1)),
            rawLeadsNeeded: Math.ceil(rawLeadsNeeded),
            qualifiedLeadsNeeded: Math.ceil(qualifiedLeadsNeeded),
            hoursNeeded: Number(hoursNeeded.toFixed(1)),
            projectedProfit: Math.round(projectedProfit),
            targetProfit: Math.round(data.yearlyIncomeGoal / factor)
        };
    };

    const salesTimePercentage = (totalSalesTimePerSale / (totalTimePerUnit || 0.1)) * 100;

    return {
        daily: calculateForPeriod('Daily', 365),
        weekly: calculateForPeriod('Weekly', 52),
        monthly: calculateForPeriod('Monthly', 12),
        quarterly: calculateForPeriod('Quarterly', 4),
        yearly: calculateForPeriod('Yearly', 1),
        recommendedPrice: Number(recommendedPrice.toFixed(2)),
        effectiveHourlyRate: data.yearlyIncomeGoal / (data.weeklyWorkHours * 52 || 1),
        maxAnnualCapacityHours: data.weeklyWorkHours * 52,
        currentAnnualHours: unitsPerWeek * 52 * totalTimePerUnit,
        variableCostPerUnit,
        totalSalesTimePerSale,
        prospectingHoursPerSale,
        qualificationHoursPerSale,
        salesTimePercentage: Number(salesTimePercentage.toFixed(1)),
        currentUnitProfit: unitProfit,
        capacityHoursPerWeek: data.weeklyWorkHours,
    };
};
