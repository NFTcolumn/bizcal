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
                    Your plan requires <strong>{metrics.weekly.hoursNeeded} hours/week</strong>.
                    You set a cap of <strong>{data.weeklyWorkHours} hours/week</strong>.
                </p>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                    Annual Profit: <span style={{ color: isUnderProfitGoal ? 'var(--danger)' : 'var(--success)' }}>${metrics.yearly.projectedProfit.toLocaleString()}</span> / ${data.yearlyIncomeGoal.toLocaleString()} goal.
                </p>
            </div>

            <div className="grid">
                <MetricCard label="Weekly Prospecting" value={metrics.weekly.leadsNeeded} suffix=" leads" />
                <MetricCard label="Effective Hourly Rate" value={metrics.effectiveHourlyRate.toFixed(2)} prefix="$" />
                <MetricCard label="Weekly Workload" value={metrics.weekly.hoursNeeded} suffix=" hrs" />
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Optimization Levers</h3>

                <div className="input-group">
                    <label>Target Sales Volume: {data.targetVolume} units/year</label>
                    <input
                        type="range"
                        min="1"
                        max={Math.max(data.targetVolume * 5, 500)}
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
                        max={Math.max(data.unitPrice * 5, 1000)}
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
                    <label>Prospecting Time: {data.prospectingTimeMinutes} min/lead</label>
                    <input
                        type="range"
                        min="1"
                        max="60"
                        value={data.prospectingTimeMinutes}
                        onChange={(e) => handleUpdate('prospectingTimeMinutes', parseFloat(e.target.value))}
                        className="slider"
                    />
                </div>

                <div className="input-group">
                    <label>Closing Session: {data.closingMeetingTimeHours} hrs/sale</label>
                    <input
                        type="range"
                        min="0.1"
                        max="20"
                        step="0.1"
                        value={data.closingMeetingTimeHours}
                        onChange={(e) => handleUpdate('closingMeetingTimeHours', parseFloat(e.target.value))}
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
                                <td>{period.leadsNeeded} contacts</td>
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
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Sales Funnel Math</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        To close <strong>{metrics.weekly.unitsPlanned} units/week</strong>, you contact <strong>{metrics.weekly.leadsNeeded} people</strong>.
                        At {data.prospectingTimeMinutes}min each, prospecting takes <strong>{(metrics.prospectingHoursPerSale * metrics.weekly.unitsPlanned).toFixed(1)} hrs/week</strong>.
                    </p>
                </div>
                <div className="card">
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Time Allocation</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        Closing sessions: <strong>{(data.closingMeetingTimeHours * metrics.weekly.unitsPlanned).toFixed(1)} hrs</strong>.
                        Production: <strong>{(data.productionTime * metrics.weekly.unitsPlanned).toFixed(1)} hrs</strong>.
                    </p>
                </div>
                <div className="card">
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Strategic Focus:</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        {isOverCapacity
                            ? `You are over capacity! Lower the prospecting time or increase your prices to hit the same goal with fewer leads.`
                            : `Your funnel is healthy. You earn $${metrics.effectiveHourlyRate}/hr across all activities.`}
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
