import type { WizardData, GoalBreakdown } from '../types/wizard';

export const calculateWizardMetrics = (data: WizardData) => {

    // Variable Costs
    const variableCostPerUnit = data.productionCost + data.shippingCost;

    // Total Time per Sale (Production + Sales efforts)
    const totalTimePerUnit = data.productionTime + (data.leadsPerSale * data.timePerLead);

    // Target Net Profit per period
    const yearlyProfitGoal = data.yearlyIncomeGoal;
    const monthlyProfitGoal = yearlyProfitGoal / 12;
    const weeklyProfitGoal = yearlyProfitGoal / 52;
    const dailyProfitGoal = weeklyProfitGoal / 5; // Assuming 5-day work week

    // Margin at current unitPrice
    const unitProfit = data.unitPrice - variableCostPerUnit;

    const calculateForPeriod = (period: string, profitGoal: number): GoalBreakdown => {
        const units = Math.ceil(profitGoal / (unitProfit > 0 ? unitProfit : 0.01));
        const hours = units * totalTimePerUnit;
        const revenue = units * data.unitPrice;

        return {
            period,
            units,
            hours: Number(hours.toFixed(1)),
            revenue: Math.round(revenue),
            profit: Math.round(units * unitProfit)
        };
    };

    return {
        daily: calculateForPeriod('Daily', dailyProfitGoal),
        weekly: calculateForPeriod('Weekly', weeklyProfitGoal),
        monthly: calculateForPeriod('Monthly', monthlyProfitGoal),
        quarterly: calculateForPeriod('Quarterly', yearlyProfitGoal / 4),
        yearly: calculateForPeriod('Yearly', yearlyProfitGoal),
        totalTimePerUnit,
        variableCostPerUnit,
        currentUnitProfit: unitProfit
    };
};
