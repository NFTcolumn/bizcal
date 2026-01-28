import type { WizardData, GoalBreakdown } from '../types/wizard';

export const calculateWizardMetrics = (data: WizardData) => {
    // Variable Costs
    const variableCostPerUnit = data.productionCost + data.shippingCost;

    // Total Time per Sale:
    // 1. Production time
    // 2. Prospecting time (Time per lead * Number of leads)
    // 3. Closing time (The final meeting)
    const prospectingHoursPerSale = (data.leadsPerSale * data.prospectingTimeMinutes) / 60;
    const totalTimePerUnit = data.productionTime + prospectingHoursPerSale + data.closingMeetingTimeHours;

    // Target Net Profit per period
    const yearlyProfitGoal = data.yearlyIncomeGoal;
    const unitProfit = data.unitPrice - variableCostPerUnit;

    const calculateForPeriod = (period: string, factor: number): GoalBreakdown => {
        const periodProfitGoal = yearlyProfitGoal / factor;
        const unitsPlanned = (data.targetVolume || 0) / factor;

        const leadsNeeded = unitsPlanned * data.leadsPerSale;
        const hoursNeeded = unitsPlanned * totalTimePerUnit;
        const projectedProfit = unitsPlanned * unitProfit;

        return {
            period,
            unitsPlanned: Number(unitsPlanned.toFixed(1)),
            leadsNeeded: Math.ceil(leadsNeeded),
            hoursNeeded: Number(hoursNeeded.toFixed(1)),
            projectedProfit: Math.round(projectedProfit),
            targetProfit: Math.round(periodProfitGoal)
        };
    };

    const results = {
        daily: calculateForPeriod('Daily', 52 * 5),
        weekly: calculateForPeriod('Weekly', 52),
        monthly: calculateForPeriod('Monthly', 12),
        quarterly: calculateForPeriod('Quarterly', 4),
        yearly: calculateForPeriod('Yearly', 1),
        totalTimePerUnit,
        prospectingHoursPerSale,
        variableCostPerUnit,
        currentUnitProfit: unitProfit,
        capacityHoursPerWeek: data.weeklyWorkHours,
        maxAnnualCapacityHours: data.weeklyWorkHours * 52
    };

    const currentAnnualHours = data.targetVolume * totalTimePerUnit;
    // Effective Hourly Rate: (Total Annual Profit) / (Total Work Hours)
    const effectiveHourlyRate = (data.targetVolume * unitProfit) / (currentAnnualHours || 0.1);

    return {
        ...results,
        currentAnnualHours: Number(currentAnnualHours.toFixed(1)),
        effectiveHourlyRate: Number(effectiveHourlyRate.toFixed(2))
    };
};
