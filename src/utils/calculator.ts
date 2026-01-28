/**
 * BizCal Calculation Utilities
 */

export interface CostItem {
  id: string;
  name: string;
  amount: number;
}

export interface CalculationResult {
  totalFixedCosts: number;
  unitVariableCost: number;
  totalUnitCost: number;
  breakevenUnits: number;
  targetPrice: number;
  totalRevenue: number;
  totalProfit: number;
}

/**
 * Calculates all business metrics based on inputs
 * @param fixedCosts List of fixed recurring costs
 * @param variableCosts List of variable costs (per unit)
 * @param goalProfit Target net profit
 * @param expectedUnits Expected number of units to sell
 */
export const calculateMetrics = (
  fixedCosts: CostItem[],
  variableCosts: CostItem[],
  goalProfit: number,
  expectedUnits: number
): CalculationResult => {
  const totalFixed = fixedCosts.reduce((sum, item) => sum + item.amount, 0);
  const unitVariable = variableCosts.reduce((sum, item) => sum + item.amount, 0);
  
  const totalUnitCost = expectedUnits > 0 
    ? (totalFixed / expectedUnits) + unitVariable 
    : unitVariable;

  // Price needed to reach goalProfit at expectedUnits
  // (Total Fixed + Total Variable + Goal Profit) / Units
  const totalCostsAtVolume = totalFixed + (unitVariable * expectedUnits);
  const targetPrice = expectedUnits > 0 
    ? (totalCostsAtVolume + goalProfit) / expectedUnits 
    : 0;

  // Breakeven Point: Units = Total Fixed / (Price - Unit Variable)
  // Here we use the targetPrice for the breakeven calculation
  const contributionMargin = targetPrice - unitVariable;
  const breakevenUnits = contributionMargin > 0 
    ? Math.ceil(totalFixed / contributionMargin) 
    : 0;

  const totalRevenue = targetPrice * expectedUnits;
  const totalProfit = totalRevenue - totalCostsAtVolume;

  return {
    totalFixedCosts: totalFixed,
    unitVariableCost: unitVariable,
    totalUnitCost,
    breakevenUnits,
    targetPrice,
    totalRevenue,
    totalProfit
  };
};
