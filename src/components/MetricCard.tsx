import React from 'react';

interface MetricCardProps {
    label: string;
    value: string | number;
    prefix?: string;
    suffix?: string;
    trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, prefix, suffix, trend }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="metric-label">{label}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '0.5rem' }}>
                {prefix && <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginRight: '0.2rem' }}>{prefix}</span>}
                <span className="metric-value">{value}</span>
                {suffix && <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '0.2rem' }}>{suffix}</span>}
            </div>
            {trend && (
                <div style={{
                    fontSize: '0.75rem',
                    marginTop: '0.5rem',
                    color: trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--danger)' : 'var(--text-muted)'
                }}>
                    {trend === 'up' ? '↑ Increasing' : trend === 'down' ? '↓ Decreasing' : '→ Stable'}
                </div>
            )}
        </div>
    );
};

export default MetricCard;
