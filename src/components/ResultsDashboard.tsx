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
    const isOverCapacity = (metrics.weekly.hoursNeeded > data.weeklyWorkHours);

    return (
        <div className="results-container">
            <div className="card" style={{
                marginBottom: '2rem',
                border: isOverCapacity ? '2px solid var(--danger)' : '2px solid var(--success)',
                background: isOverCapacity ? 'rgba(255, 71, 87, 0.05)' : 'rgba(46, 213, 115, 0.05)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ color: isOverCapacity ? 'var(--danger)' : 'var(--success)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {isOverCapacity ? '❗ Plan Not Possible' : '✅ Sustainable Plan'}
                        </h2>
                        <p style={{ fontSize: '1.1rem', maxWidth: '600px' }}>
                            {isOverCapacity
                                ? `The hours required to hit this volume exceed your limits. You need to increase your price or improve your sales efficiency.`
                                : `Your plan is solid! You'll earn $${metrics.yearly.projectedProfit.toLocaleString()} within your ${data.weeklyWorkHours}hr/wk limit.`}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Annual Profit</div>
                        <div style={{ fontSize: '2.4rem', fontWeight: 'bold', color: isUnderProfitGoal ? 'var(--danger)' : 'var(--success)' }}>
                            ${metrics.yearly.projectedProfit.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid">
                <MetricCard
                    label="Weekly Potential"
                    value={metrics.weekly.projectedProfit.toLocaleString()}
                    prefix="$"
                    status={isOverCapacity ? 'warning' : 'success'}
                />
                <MetricCard label="Sales Time %" value={metrics.salesTimePercentage} suffix="%" />
                <MetricCard label="Effective Rate" value={metrics.effectiveHourlyRate.toFixed(2)} prefix="$" />
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Optimization Levers</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Tweak these to balance your profit goals with your actual time.
                </p>

                <div className="grid">
                    <div className="input-group">
                        <label>Sales Volume: {data.targetVolume} units/yr</label>
                        <input type="range" min="1" max={Math.max(data.targetVolume * 3, 200)} value={data.targetVolume} onChange={(e) => handleUpdate('targetVolume', parseFloat(e.target.value))} className="slider" />
                    </div>
                    <div className="input-group">
                        <label>Unit Price: ${data.unitPrice}</label>
                        <input type="range" min={Math.ceil(metrics.variableCostPerUnit)} max={Math.max(data.unitPrice * 3, 2000)} value={data.unitPrice} onChange={(e) => handleUpdate('unitPrice', parseFloat(e.target.value))} className="slider" />
                    </div>
                </div>

                <div className="grid">
                    <div className="input-group">
                        <label>Prospecting: {data.prospectingTimeMinutes}m / lead</label>
                        <input type="range" min="1" max="60" value={data.prospectingTimeMinutes} onChange={(e) => handleUpdate('prospectingTimeMinutes', parseFloat(e.target.value))} className="slider" />
                    </div>
                    <div className="input-group">
                        <label>Qualifying: {data.qualificationTimeMinutes}m / lead</label>
                        <input type="range" min="1" max="120" value={data.qualificationTimeMinutes} onChange={(e) => handleUpdate('qualificationTimeMinutes', parseFloat(e.target.value))} className="slider" />
                    </div>
                    <div className="input-group">
                        <label>Production: {data.productionTime} hrs</label>
                        <input type="range" min="0.1" max="40" step="0.1" value={data.productionTime} onChange={(e) => handleUpdate('productionTime', parseFloat(e.target.value))} className="slider" />
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Activity Breakdown</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Contacts</th>
                            <th>Qualified</th>
                            <th>Sales</th>
                            <th>Hours</th>
                            <th>Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[metrics.daily, metrics.weekly, metrics.monthly, metrics.yearly].map(period => (
                            <tr key={period.period}>
                                <td>{period.period}</td>
                                <td>{period.rawLeadsNeeded}</td>
                                <td>{period.qualifiedLeadsNeeded}</td>
                                <td>{period.unitsPlanned}</td>
                                <td style={{ color: period.hoursNeeded > (data.weeklyWorkHours * 52 / (period.period === 'Yearly' ? 1 : period.period === 'Monthly' ? 12 : period.period === 'Weekly' ? 52 : 260)) ? 'var(--danger)' : 'var(--text-main)' }}>
                                    {period.hoursNeeded}h
                                </td>
                                <td>${period.projectedProfit.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid" style={{ marginTop: '2rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Time Distribution</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        Production: <strong>{((data.productionTime * metrics.weekly.unitsPlanned)).toFixed(1)}h/wk</strong><br />
                        Sales: <strong>{((metrics.totalSalesTimePerSale * metrics.weekly.unitsPlanned)).toFixed(1)}h/wk</strong>
                    </p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
                    <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>Strategic Fixes</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        {isOverCapacity ? (
                            <>
                                1. <strong>Raise Prices:</strong> High prices lower the "Volume" needed for the same profit.<br />
                                2. <strong>Fix Funnel:</strong> Automate the prospecting or qualification stages.<br />
                                3. <strong>Qualification:</strong> Increase friction to spend time only on high-intent leads.
                            </>
                        ) : (
                            "Your balance is healthy. Scale volume when you're ready for more output."
                        )}
                    </p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Economic Reality</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        Every hour you work on this business is worth <strong>${metrics.effectiveHourlyRate.toFixed(2)}</strong>.<br /><br />
                        Focus on tasks where your personal input generates the most value.
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
