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

    return (
        <div className="results-container">
            <div className="card" style={{
                marginBottom: '2rem',
                border: '2px solid var(--accent-primary)',
                background: 'rgba(56, 189, 248, 0.05)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                            Your Recommended Price
                        </h2>
                        <p style={{ fontSize: '1.1rem', maxWidth: '600px' }}>
                            To hit your <strong>${data.yearlyIncomeGoal.toLocaleString()}</strong> goal working <strong>{data.weeklyWorkHours} hours/week</strong>, you should charge:
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                            ${metrics.recommendedPrice.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>per unit</div>
                    </div>
                </div>
            </div>

            <div className="grid">
                <MetricCard
                    label="Hourly Worth"
                    value={metrics.effectiveHourlyRate.toFixed(2)}
                    prefix="$"
                    status="success"
                />
                <MetricCard label="Max Weekly Output" value={metrics.weekly.unitsPlanned} suffix=" units" />
                <MetricCard label="Sales Time %" value={metrics.salesTimePercentage} suffix="%" />
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Business Model Levers</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Tweak these to see how your required price changes.
                </p>

                <div className="grid">
                    <div className="input-group">
                        <label>Annual Profit Goal: ${data.yearlyIncomeGoal.toLocaleString()}</label>
                        <input type="range" min="10000" max="1000000" step="5000" value={data.yearlyIncomeGoal} onChange={(e) => handleUpdate('yearlyIncomeGoal', parseFloat(e.target.value))} className="slider" />
                    </div>
                    <div className="input-group">
                        <label>Weekly Effort: {data.weeklyWorkHours} hours</label>
                        <input type="range" min="1" max="100" value={data.weeklyWorkHours} onChange={(e) => handleUpdate('weeklyWorkHours', parseFloat(e.target.value))} className="slider" />
                    </div>
                </div>

                <div className="grid">
                    <div className="input-group">
                        <label>Production Time: {data.productionTime} hrs</label>
                        <input type="range" min="0.1" max="40" step="0.1" value={data.productionTime} onChange={(e) => handleUpdate('productionTime', parseFloat(e.target.value))} className="slider" />
                    </div>
                    <div className="input-group">
                        <label>Prospecting: {data.prospectingTimeMinutes}m / lead</label>
                        <input type="range" min="1" max="60" value={data.prospectingTimeMinutes} onChange={(e) => handleUpdate('prospectingTimeMinutes', parseFloat(e.target.value))} className="slider" />
                    </div>
                    <div className="input-group">
                        <label>Qualification: {data.qualificationTimeMinutes}m / lead</label>
                        <input type="range" min="1" max="60" value={data.qualificationTimeMinutes} onChange={(e) => handleUpdate('qualificationTimeMinutes', parseFloat(e.target.value))} className="slider" />
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Operational Plan</h3>
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
                                <td>{period.hoursNeeded}h</td>
                                <td>${period.projectedProfit.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid" style={{ marginTop: '2rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Math Breakdown</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        At <strong>{data.weeklyWorkHours} hrs/wk</strong>, you can produce/sell <strong>{metrics.yearly.unitsPlanned} units/yr</strong>.<br /><br />
                        To net <strong>${data.yearlyIncomeGoal.toLocaleString()}</strong>, each unit must generate <strong>${(data.yearlyIncomeGoal / metrics.yearly.unitsPlanned).toFixed(2)}</strong> profit.<br /><br />
                        Price = Profit + Materials (${data.productionCost}) + Shipping (${data.shippingCost}).
                    </p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
                    <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>Strategic Levers</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        If the price is too high for your market:<br />
                        1. <strong>Improve Efficiency:</strong> Lower production or sales time to sell more units.<br />
                        2. <strong>Lower Goal:</strong> Reduce your income target.<br />
                        3. <strong>Work More:</strong> Increase your weekly hours.
                    </p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Economic Reality</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        Your time in this model is valued at <strong>${metrics.effectiveHourlyRate.toFixed(2)}/hr</strong>.<br /><br />
                        Any task you can delegate for less than this rate is a net win for your business.
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
