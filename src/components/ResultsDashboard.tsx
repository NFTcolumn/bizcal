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
                    {isOverCapacity ? 'Over Capacity' : isUnderProfitGoal ? 'Target Shortfall' : 'Profitable & Sustainable'}
                </h2>
                <div className="grid" style={{ gap: '1rem' }}>
                    <div>
                        <p><strong>{metrics.weekly.hoursNeeded} hrs/week</strong> required</p>
                        <p className="text-muted">Limit: {data.weeklyWorkHours} hrs</p>
                    </div>
                    <div>
                        <p><strong>${metrics.yearly.projectedProfit.toLocaleString()}</strong> projected profit</p>
                        <p className="text-muted">Goal: ${data.yearlyIncomeGoal.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid">
                <MetricCard label="Raw Leads Needed" value={metrics.weekly.rawLeadsNeeded} suffix=" leads/wk" />
                <MetricCard label="Sales Time %" value={metrics.salesTimePercentage} suffix="%" />
                <MetricCard label="Effective Hourly Rate" value={metrics.effectiveHourlyRate.toFixed(2)} prefix="$" />
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Friction & Sales Optimization</h3>

                <div className="grid">
                    <div className="input-group">
                        <label>Sales Volume: {data.targetVolume} units/yr</label>
                        <input type="range" min="1" max={Math.max(data.targetVolume * 3, 200)} value={data.targetVolume} onChange={(e) => handleUpdate('targetVolume', parseFloat(e.target.value))} className="slider" />
                    </div>
                    <div className="input-group">
                        <label>Unit Price: ${data.unitPrice}</label>
                        <input type="range" min={Math.ceil(metrics.variableCostPerUnit)} max={Math.max(data.unitPrice * 3, 1000)} value={data.unitPrice} onChange={(e) => handleUpdate('unitPrice', parseFloat(e.target.value))} className="slider" />
                    </div>
                </div>

                <div className="grid">
                    <div className="input-group">
                        <label>Prospecting: {data.prospectingTimeMinutes}m / lead</label>
                        <input type="range" min="1" max="60" value={data.prospectingTimeMinutes} onChange={(e) => handleUpdate('prospectingTimeMinutes', parseFloat(e.target.value))} className="slider" />
                    </div>
                    <div className="input-group">
                        <label>Qualification: {data.qualificationTimeMinutes}m / lead</label>
                        <input type="range" min="1" max="120" value={data.qualificationTimeMinutes} onChange={(e) => handleUpdate('qualificationTimeMinutes', parseFloat(e.target.value))} className="slider" />
                    </div>
                    <div className="input-group">
                        <label>Closing Call: {data.closingMeetingTimeHours}h / sale</label>
                        <input type="range" min="0.5" max="10" step="0.5" value={data.closingMeetingTimeHours} onChange={(e) => handleUpdate('closingMeetingTimeHours', parseFloat(e.target.value))} className="slider" />
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Lead Flow & Capacity</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Raw Leads</th>
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
                <div className="card">
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Funnel Dynamics</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        You spend <strong>{metrics.salesTimePercentage}%</strong> of your time on sales.
                        To hit your goal, you need <strong>{metrics.weekly.rawLeadsNeeded} prospects</strong> every week.
                        <strong> {metrics.weekly.qualifiedLeadsNeeded}</strong> must qualify for a closing call.
                    </p>
                </div>
                <div className="card">
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Work Breakdown</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        Weekly Hours:<br />
                        • Prospecting: {((metrics.prospectingHoursPerSale * metrics.weekly.unitsPlanned)).toFixed(1)}h<br />
                        • Qualifying: {((metrics.qualificationHoursPerSale * metrics.weekly.unitsPlanned)).toFixed(1)}h<br />
                        • Closing: {((data.closingMeetingTimeHours * metrics.weekly.unitsPlanned)).toFixed(1)}h<br />
                        • Production: {((data.productionTime * metrics.weekly.unitsPlanned)).toFixed(1)}h
                    </p>
                </div>
                <div className="card">
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Advice:</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        {isOverCapacity
                            ? `You are over capacity by ${(metrics.weekly.hoursNeeded - data.weeklyWorkHours).toFixed(1)} hrs/week. Automate the prospecting stage or increase your Qualification friction.`
                            : `Your strategy is solid. Focus on maintaining a flow of ${metrics.weekly.rawLeadsNeeded} leads/week.`}
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
