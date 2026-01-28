import React, { useMemo } from 'react';
import type { WizardData } from '../types/wizard';
import { calculateWizardMetrics } from '../utils/wizardCalculator';
import MetricCard from './MetricCard';

interface ResultsDashboardProps {
    data: WizardData;
    onUpdate: (data: WizardData) => void;
    onReset: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, onUpdate, onReset }) => {
    const metrics = useMemo(() => calculateWizardMetrics(data), [data]);

    const handleUpdate = (field: keyof WizardData, value: number) => {
        onUpdate({ ...data, [field]: value });
    };

    const isUnderGoal = metrics.weekly.actualProfit < metrics.weekly.targetProfit;
    const weeklyGap = metrics.weekly.targetProfit - metrics.weekly.actualProfit;

    return (
        <div className="results-container">
            <div className="card" style={{ marginBottom: '2rem', border: isUnderGoal ? '1px solid var(--danger)' : '1px solid var(--success)' }}>
                <h2 style={{ color: isUnderGoal ? 'var(--danger)' : 'var(--success)', marginBottom: '1rem' }}>
                    {isUnderGoal ? 'Capacity Warning' : 'Plan Achievable'}
                </h2>
                <p style={{ fontSize: '1.1rem' }}>
                    Your goal requires <strong>{metrics.weekly.hoursNeeded} hours/week</strong>, but you only want to work <strong>{data.weeklyWorkHours} hours/week</strong>.
                </p>
                {isUnderGoal ? (
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                        At your current capacity, you will earn <span style={{ color: 'var(--accent-secondary)' }}>${metrics.weekly.actualProfit.toLocaleString()}</span> per week.
                        You are <strong>${weeklyGap.toLocaleString()} under</strong> your weekly goal.
                    </p>
                ) : (
                    <p style={{ marginTop: '0.5rem', color: 'var(--success)' }}>
                        You have ample capacity to reach your goals!
                    </p>
                )}
            </div>

            <div className="grid">
                <MetricCard label="Potential Weekly Profit" value={metrics.weekly.actualProfit.toLocaleString()} prefix="$" />
                <MetricCard label="Effective Hourly Rate" value={metrics.effectiveHourlyRate.toFixed(2)} prefix="$" />
                <MetricCard label="Weekly Time Gap" value={Math.max(0, metrics.weekly.hoursNeeded - data.weeklyWorkHours).toFixed(1)} suffix="hrs" />
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Optimization Levers</h3>

                <div className="input-group">
                    <label>Adjust Unit Price: ${data.unitPrice}</label>
                    <input
                        type="range"
                        min={Math.ceil(metrics.variableCostPerUnit)}
                        max={data.unitPrice * 5}
                        value={data.unitPrice}
                        onChange={(e) => handleUpdate('unitPrice', parseFloat(e.target.value))}
                        className="slider"
                    />
                </div>

                <div className="input-group">
                    <label>Material Cost: ${data.productionCost}</label>
                    <input
                        type="range"
                        min="0"
                        max={Math.max(data.productionCost * 1.5, 50)}
                        value={data.productionCost}
                        onChange={(e) => handleUpdate('productionCost', parseFloat(e.target.value))}
                        className="slider"
                    />
                </div>

                <div className="input-group">
                    <label>Production Efficiency (Time per Unit): {data.productionTime} hrs</label>
                    <input
                        type="range"
                        min="0.1"
                        max={Math.max(data.productionTime * 1.5, 5)}
                        step="0.1"
                        value={data.productionTime}
                        onChange={(e) => handleUpdate('productionTime', parseFloat(e.target.value))}
                        className="slider"
                    />
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Target vs. Reality</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Units to Goal</th>
                            <th>Max Capacity Sales</th>
                            <th>Profit at Capacity</th>
                            <th>Goal Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[metrics.daily, metrics.weekly, metrics.monthly, metrics.quarterly, metrics.yearly].map(period => (
                            <tr key={period.period}>
                                <td>{period.period}</td>
                                <td>{period.unitsNeeded} units</td>
                                <td style={{ color: period.maxUnits < period.unitsNeeded ? 'var(--danger)' : 'var(--text-main)' }}>
                                    {period.maxUnits} units
                                </td>
                                <td>${period.actualProfit.toLocaleString()}</td>
                                <td>${period.targetProfit.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid" style={{ marginTop: '2rem' }}>
                <div className="card">
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>How to lower prices?</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        Reduce raw material costs by buying in bulk or automate production to reduce
                        <strong> {data.productionTime} hrs</strong> time-per-unit.
                    </p>
                </div>
                <div className="card">
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>How to save time?</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        Improve lead qualification (lower <strong>{data.leadsPerSale} leads/sale</strong>)
                        or create scaleable marketing assets.
                    </p>
                </div>
                <div className="card">
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Most important move:</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        {isUnderGoal
                            ? `You need to increase price or efficiency by ${Math.ceil((weeklyGap / (metrics.currentUnitProfit || 1)))} units worth of profit to meet your goal.`
                            : `Your strategy generates $${metrics.effectiveHourlyRate}/hr. You are well within your ${data.weeklyWorkHours}hr/week capacity.`}
                    </p>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button className="btn btn-ghost" onClick={onReset}>Start Over</button>
            </div>
        </div>
    );
};

export default ResultsDashboard;
