import { useState, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { calculateMetrics } from './utils/calculator';
import type { CostItem } from './utils/calculator';
import CostList from './components/CostList';
import MetricCard from './components/MetricCard';
import TaskTimer from './components/TaskTimer';

function App() {
  const [fixedCosts, setFixedCosts] = useState<CostItem[]>([
    { id: uuidv4(), name: 'Rent & Utilities', amount: 1500 },
    { id: uuidv4(), name: 'Subscriptions', amount: 200 }
  ]);
  const [variableCosts, setVariableCosts] = useState<CostItem[]>([
    { id: uuidv4(), name: 'Raw Materials', amount: 12 },
    { id: uuidv4(), name: 'Packaging', amount: 3 }
  ]);
  const [goalProfit, setGoalProfit] = useState<number>(5000);
  const [expectedUnits, setExpectedUnits] = useState<number>(500);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [desiredHourlyRate, setDesiredHourlyRate] = useState<number>(50);

  const totalHours = useMemo(() => totalSeconds / 3600, [totalSeconds]);

  const metrics = useMemo(() => {
    return calculateMetrics(fixedCosts, variableCosts, goalProfit, expectedUnits, totalHours);
  }, [fixedCosts, variableCosts, goalProfit, expectedUnits, totalHours]);

  const handleTimeUpdate = useCallback((seconds: number) => {
    setTotalSeconds(seconds);
  }, []);

  const addFixed = () => setFixedCosts([...fixedCosts, { id: uuidv4(), name: '', amount: 0 }]);
  const updateFixed = (id: string, field: string, value: any) => {
    setFixedCosts(fixedCosts.map((c: CostItem) => c.id === id ? { ...c, [field]: value } : c));
  };
  const removeFixed = (id: string) => setFixedCosts(fixedCosts.filter((c: CostItem) => c.id !== id));

  const addVar = () => setVariableCosts([...variableCosts, { id: uuidv4(), name: '', amount: 0 }]);
  const updateVar = (id: string, field: string, value: any) => {
    setVariableCosts(variableCosts.map((c: CostItem) => c.id === id ? { ...c, [field]: value } : c));
  };
  const removeVar = (id: string) => setVariableCosts(variableCosts.filter((c: CostItem) => c.id !== id));

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/logo.png" alt="BizCal Logo" style={{ width: '120px', height: '120px', marginBottom: '1.5rem', borderRadius: '1rem', boxShadow: '0 0 20px rgba(79, 172, 254, 0.3)' }} />
        <h1 className="title-gradient" style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>BizCal</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Precision pricing and profit planning for your next venture.
        </p>
      </header>

      <section className="grid" style={{ marginBottom: '2rem' }}>
        <MetricCard
          label="Recommended Unit Price"
          value={metrics.targetPrice.toFixed(2)}
          prefix="$"
        />
        <MetricCard
          label="Effective Hourly Rate"
          value={metrics.effectiveHourlyRate.toFixed(2)}
          prefix="$"
          trend={metrics.effectiveHourlyRate >= desiredHourlyRate ? 'up' : 'down'}
        />
        <MetricCard
          label="Breakeven Point"
          value={metrics.breakevenUnits}
          suffix="units"
        />
      </section>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <TaskTimer onTimeUpdate={handleTimeUpdate} />

          <CostList
            title="Fixed Costs (Monthly)"
            items={fixedCosts}
            onAdd={addFixed}
            onUpdate={updateFixed}
            onRemove={removeFixed}
            placeholder="e.g. Rent, Salaries..."
          />
          <CostList
            title="Variable Costs (Per Unit)"
            items={variableCosts}
            onAdd={addVar}
            onUpdate={updateVar}
            onRemove={removeVar}
            placeholder="e.g. Materials, Shipping..."
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3>Business Goals</h3>

            <div className="input-group">
              <label>Target Monthly Net Profit</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</span>
                <input
                  type="number"
                  value={goalProfit}
                  onChange={(e) => setGoalProfit(parseFloat(e.target.value) || 0)}
                  style={{ paddingLeft: '1.75rem' }}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Desired Hourly Rate</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</span>
                <input
                  type="number"
                  value={desiredHourlyRate}
                  onChange={(e) => setDesiredHourlyRate(parseFloat(e.target.value) || 0)}
                  style={{ paddingLeft: '1.75rem' }}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Expected Sales Volume (Units)</label>
              <input
                type="number"
                value={expectedUnits}
                onChange={(e) => setExpectedUnits(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Forecast at this Volume</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Total Revenue</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Total Costs</span>
                <span>${(metrics.totalFixedCosts + metrics.unitVariableCost * expectedUnits).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '1rem 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700 }}>
                <span>Projected Net Profit</span>
                <span style={{ color: metrics.totalProfit >= goalProfit ? 'var(--success)' : 'var(--text-main)' }}>
                  ${metrics.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ marginTop: '4rem', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        Built for entrepreneurs who value mathematical precision. &copy; 2026 BizCal.
      </footer>
    </div>
  );
}

export default App;
