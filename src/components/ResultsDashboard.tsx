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

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...data, unitPrice: parseFloat(e.target.value) || 0 });
    };

    const adviceRows = [
        { title: "How to lower prices?", text: "Reduce raw material costs by buying in bulk or automate production to reduce time-per-unit." },
        { title: "How to save time?", text: "Improve lead qualification (lower Leads/Sale) or create scaleable marketing assets." },
        { title: "The most important part of your business right now:", text: metrics.currentUnitProfit < 0 ? "Your current price is below variable costs. Increase price immediately." : "Consistent lead generation to meet your daily volume goals." }
    ];

    return (
        <div className="results-container">
            <div className="grid">
                <MetricCard label="Recommended Daily Units" value={metrics.daily.units} suffix="units" />
                <MetricCard label="Profit per Unit" value={metrics.currentUnitProfit.toFixed(2)} prefix="$" />
                <MetricCard label="Total Time per Sale" value={metrics.totalTimePerUnit.toFixed(1)} suffix="hrs" />
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Optimization Slider</h3>
                <div className="input-group">
                    <label>Adjust Unit Price: ${data.unitPrice}</label>
                    <input
                        type="range"
                        min={Math.ceil(metrics.variableCostPerUnit)}
                        max={data.unitPrice * 3}
                        value={data.unitPrice}
                        onChange={handlePriceChange}
                        className="slider"
                    />
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Financial & Sales Breakdown</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Sales Needed</th>
                            <th>Work Hours</th>
                            <th>Revenue</th>
                            <th>Goal Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[metrics.daily, metrics.weekly, metrics.monthly, metrics.quarterly, metrics.yearly].map(period => (
                            <tr key={period.period}>
                                <td>{period.period}</td>
                                <td>{period.units} units</td>
                                <td>{period.hours} hrs</td>
                                <td>${period.revenue.toLocaleString()}</td>
                                <td>${period.profit.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid" style={{ marginTop: '2rem' }}>
                {adviceRows.map(row => (
                    <div className="card" key={row.title}>
                        <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{row.title}</h4>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{row.text}</p>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button className="btn btn-ghost" onClick={onReset}>Start Over</button>
            </div>
        </div>
    );
};

export default ResultsDashboard;
