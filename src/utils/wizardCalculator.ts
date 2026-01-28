import type { WizardData, GoalBreakdown } from '../types/wizard';

export const calculateWizardMetrics = (data: WizardData) => {
    // Variable Costs
    const variableCostPerUnit = data.productionCost + data.shippingCost;

    // Total Time per Sale (Production + Sales efforts)
    const totalTimePerUnit = data.productionTime + (data.leadsPerSale * data.timePerLead);

    // Target Net Profit per period
    const yearlyProfitGoal = data.yearlyIncomeGoal;
    const unitProfit = data.unitPrice - variableCostPerUnit;

    const calculateForPeriod = (period: string, factor: number): GoalBreakdown => {
        const periodProfitGoal = yearlyProfitGoal / factor;
        const periodCapacityHours = (data.weeklyWorkHours * 52) / factor;

        const unitsNeeded = Math.ceil(periodProfitGoal / (unitProfit > 0 ? unitProfit : 0.01));
        const hoursNeeded = unitsNeeded * totalTimePerUnit;

        const maxUnits = Math.floor(periodCapacityHours / (totalTimePerUnit > 0 ? totalTimePerUnit : 0.1));
        const actualProfit = maxUnits * unitProfit;

        return {
            period,
            unitsNeeded,
            maxUnits,
            hoursNeeded: Number(hoursNeeded.toFixed(1)),
            actualProfit: Math.round(actualProfit),
            targetProfit: Math.round(periodProfitGoal)
        };
    };

    return {
        daily: calculateForPeriod('Daily', 52 * 5), // Assumes 5 day week
        weekly: calculateForPeriod('Weekly', 52),
        monthly: calculateForPeriod('Monthly', 12),
        quarterly: calculateForPeriod('Quarterly', 4),
        yearly: calculateForPeriod('Yearly', 1),
        totalTimePerUnit,
        variableCostPerUnit,
        currentUnitProfit: unitProfit,
        capacityHoursPerWeek: data.weeklyWorkHours
    };
};
