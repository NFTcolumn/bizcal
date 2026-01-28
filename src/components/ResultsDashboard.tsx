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

    const isUnderProfitGoal = (metrics.yearly.projectedProfit < data.yearlyIncomeGoal);
    const isOverCapacity = (metrics.currentAnnualHours > metrics.maxAnnualCapacityHours);

    return (
        <div className="results-container">
            <div className="card" style={{ marginBottom: '2rem', border: (isUnderProfitGoal || isOverCapacity) ? '1px solid var(--danger)' : '1px solid var(--success)' }}>
                <h2 style={{ color: (isUnderProfitGoal || isOverCapacity) ? 'var(--danger)' : 'var(--success)', marginBottom: '1rem' }}>
                    {isOverCapacity ? 'Time Capacity Exceeded' : isUnderProfitGoal ? 'Profit Goal Not Met' : 'Solid Business Plan'}
                </h2>
                <p style={{ fontSize: '1.1rem' }}>
                    Your plan requires <strong>{metrics.weekly.hoursNeeded} hours/week</strong> at your desired volume.
                    You set a cap of <strong>{data.weeklyWorkHours} hours/week</strong>.
                </p>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                    Target Profit: <span style={{ color: 'var(--text-main)' }}>${data.yearlyIncomeGoal.toLocaleString()}</span> |
                    Projected Profit: <span style={{ color: isUnderProfitGoal ? 'var(--danger)' : 'var(--success)' }}>${metrics.yearly.projectedProfit.toLocaleString()}</span>
                </p>
            </div>

            <div className="grid">
                <MetricCard label="Total Leads Needed" value={metrics.weekly.leadsNeeded} suffix="leads/wk" />
                <MetricCard label="Projected Weekly Profit" value={metrics.weekly.projectedProfit.toLocaleString()} prefix="$" />
                <MetricCard label="Effective Hourly Rate" value={metrics.effectiveHourlyRate.toFixed(2)} prefix="$" />
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Optimization Levers</h3>

                <div className="input-group">
                    <label>Volume Leverage (Annual Sales): {data.targetVolume} units</label>
                    <input
                        type="range"
                        min="1"
                        max={data.targetVolume * 5 || 1000}
                        value={data.targetVolume}
                        onChange={(e) => handleUpdate('targetVolume', parseFloat(e.target.value))}
                        className="slider"
                    />
                </div>

                <div className="input-group">
                    <label>Adjust Unit Price: ${data.unitPrice}</label>
                    <input
                        type="range"
                        min={Math.ceil(metrics.variableCostPerUnit)}
                        max={data.unitPrice * 5 || 500}
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
                        max={Math.max(data.productionCost * 1.5, 100)}
                        value={data.productionCost}
                        onChange={(e) => handleUpdate('productionCost', parseFloat(e.target.value))}
                        className="slider"
                    />
                </div>

                <div className="input-group">
                    <label>Work Efficiency (Time per Unit): {data.productionTime} hrs</label>
                    <input
                        type="range"
                        min="0.1"
                        max={Math.max(data.productionTime * 2, 10)}
                        step="0.1"
                        value={data.productionTime}
                        onChange={(e) => handleUpdate('productionTime', parseFloat(e.target.value))}
                        className="slider"
                    />
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Activity Breakdown</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Sales Target</th>
                            <th>Leads Needed</th>
                            <th>Work Hours</th>
                            <th>Projected Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[metrics.daily, metrics.weekly, metrics.monthly, metrics.quarterly, metrics.yearly].map(period => (
                            <tr key={period.period}>
                                <td>{period.period}</td>
                                <td>{period.unitsPlanned} units</td>
                                <td>{period.leadsNeeded} leads</td>
                                <td style={{ color: period.hoursNeeded > (data.weeklyWorkHours * 52 / (period.period === 'Yearly' ? 1 : period.period === 'Quarterly' ? 4 : period.period === 'Monthly' ? 12 : period.period === 'Weekly' ? 52 : 260)) ? 'var(--danger)' : 'var(--text-main)' }}>
                                    {period.hoursNeeded} hrs
                                </td>
                                <td>${period.projectedProfit.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid" style={{ marginTop: '2rem' }}>
                <div className="card">
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Conversion Math</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        To sell <strong>{metrics.weekly.unitsPlanned} units/week</strong>, you must generate
                        <strong> {metrics.weekly.leadsNeeded} leads</strong> at your {data.leadsPerSale}:1 conversion rate.
                    </p>
                </div>
                <div className="card">
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Time Management</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        Each sale takes <strong>{metrics.totalTimePerUnit.toFixed(1)} hrs</strong> of combined production and sales efforts.
                        At scale, efficiency is your biggest lever.
                    </p>
                </div>
                <div className="card">
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Status Advice:</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        {isOverCapacity
                            ? `Your plan requires ${metrics.weekly.hoursNeeded} hrs, exceeding your ${data.weeklyWorkHours}hr limit. Increase price or efficiency to reduce volume requirements.`
                            : isUnderProfitGoal
                                ? `You are $${(data.yearlyIncomeGoal - metrics.yearly.projectedProfit).toLocaleString()} short of your goal. Slide volume or price up.`
                                : `Perfect! You generate $${metrics.effectiveHourlyRate}/hr and finish your work in ${metrics.weekly.hoursNeeded} hrs/week.`}
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
