import { useState } from 'react';
import Wizard from './components/Wizard';
import ResultsDashboard from './components/ResultsDashboard';
import type { WizardData } from './types/wizard';

function App() {
  const [wizardData, setWizardData] = useState<WizardData | null>(null);
  const [isResultView, setIsResultView] = useState(false);

  const handleWizardComplete = (data: WizardData) => {
    setWizardData(data);
    setIsResultView(true);
  };

  const handleUpdateData = (newData: WizardData) => {
    setWizardData(newData);
  };

  const handleReset = () => {
    setIsResultView(false);
    setWizardData(null);
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/logo.png" alt="BizCal Logo" style={{ width: '80px', height: '80px', marginBottom: '1.5rem', borderRadius: '1rem', boxShadow: '0 0 20px rgba(79, 172, 254, 0.3)' }} />
        <h1 className="title-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>BizCal</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Guided Business Planning for Professionals
        </p>
      </header>

      <main>
        {!isResultView ? (
          <Wizard onComplete={handleWizardComplete} />
        ) : (
          wizardData && (
            <ResultsDashboard
              data={wizardData}
              onUpdate={handleUpdateData}
              onReset={handleReset}
            />
          )
        )}
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        &copy; 2026 BizCal Planning Tool. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
