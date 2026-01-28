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

    // Target Net Profit per period
    const unitProfit = data.unitPrice - variableCostPerUnit;

    const calculateForPeriod = (period: string, factor: number): GoalBreakdown => {
        const unitsPlanned = (data.targetVolume || 0) / factor;
        const rawLeadsNeeded = unitsPlanned * rawLeadsPerSale;
        const qualifiedLeadsNeeded = unitsPlanned * data.qualifiedPerSale;
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

    const currentAnnualHours = data.targetVolume * totalTimePerUnit;
    const salesTimePercentage = (totalSalesTimePerSale / (totalTimePerUnit || 0.1)) * 100;

    return {
        daily: calculateForPeriod('Daily', 52 * 5),
        weekly: calculateForPeriod('Weekly', 52),
        monthly: calculateForPeriod('Monthly', 12),
        quarterly: calculateForPeriod('Quarterly', 4),
        yearly: calculateForPeriod('Yearly', 1),
        totalTimePerUnit,
        totalSalesTimePerSale,
        prospectingHoursPerSale,
        qualificationHoursPerSale,
        variableCostPerUnit,
        currentUnitProfit: unitProfit,
        capacityHoursPerWeek: data.weeklyWorkHours,
        maxAnnualCapacityHours: data.weeklyWorkHours * 52,
        currentAnnualHours: Number(currentAnnualHours.toFixed(1)),
        effectiveHourlyRate: Number(((data.targetVolume * unitProfit) / (currentAnnualHours || 0.1)).toFixed(2)),
        salesTimePercentage: Number(salesTimePercentage.toFixed(1))
    };
};
