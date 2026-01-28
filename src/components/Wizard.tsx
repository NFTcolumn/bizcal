import React, { useState } from 'react';
import type { WizardData } from '../types/wizard';

interface WizardProps {
    onComplete: (data: WizardData) => void;
}

const Wizard: React.FC<WizardProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<WizardData>({
        productionCost: 0,
        productionTime: 0,
        shippingCost: 0,
        weeklyWorkHours: 40,
        yearlyIncomeGoal: 60000,
        rawLeadsPerQualified: 10,
        prospectingTimeMinutes: 5,
        qualifiedPerSale: 5,
        qualificationTimeMinutes: 15,
        closingMeetingTimeHours: 3,
        unitPrice: 100,
        targetVolume: 0
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const updateData = (field: keyof WizardData, value: number) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="wizard-step">
                        <h2>Product Costs</h2>
                        <div className="grid">
                            <div className="input-group">
                                <label>Material Cost Per Unit ($)</label>
                                <div className="input-wrapper">
                                    <span>$</span>
                                    <input
                                        type="number"
                                        value={data.productionCost || ''}
                                        onChange={e => updateData('productionCost', parseFloat(e.target.value) || 0)}
                                        placeholder="12"
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Shipping / Variable Cost ($)</label>
                                <div className="input-wrapper">
                                    <span>$</span>
                                    <input
                                        type="number"
                                        value={data.shippingCost || ''}
                                        onChange={e => updateData('shippingCost', parseFloat(e.target.value) || 0)}
                                        placeholder="10"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="btn-row">
                            <button className="btn btn-primary" onClick={nextStep}>Next: Capacity & Goal</button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="wizard-step">
                        <h2>Capacity & Goal</h2>
                        <div className="input-group">
                            <label>Annual Net Profit Goal ($)</label>
                            <input
                                type="number"
                                value={data.yearlyIncomeGoal || ''}
                                onChange={e => updateData('yearlyIncomeGoal', parseFloat(e.target.value) || 0)}
                                placeholder="100000"
                            />
                        </div>
                        <div className="grid">
                            <div className="input-group">
                                <label>Hours you can work per week?</label>
                                <input
                                    type="number"
                                    value={data.weeklyWorkHours || ''}
                                    onChange={e => updateData('weeklyWorkHours', parseFloat(e.target.value) || 0)}
                                    placeholder="30"
                                />
                            </div>
                            <div className="input-group">
                                <label>Hours to MAKE one unit?</label>
                                <input
                                    type="number"
                                    value={data.productionTime || ''}
                                    onChange={e => updateData('productionTime', parseFloat(e.target.value) || 0)}
                                    placeholder="1"
                                />
                            </div>
                        </div>
                        <div className="btn-row">
                            <button className="btn btn-ghost" onClick={prevStep}>Back</button>
                            <button className="btn btn-primary" onClick={nextStep}>Next: Sales Funnel</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="wizard-step">
                        <h2>Sales Funnel Logic</h2>
                        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>How long does it take to find and close a client?</p>
                        <div className="grid">
                            <div className="input-group">
                                <label>Leads to find 1 Qualified?</label>
                                <input
                                    type="number"
                                    value={data.rawLeadsPerQualified || ''}
                                    onChange={e => updateData('rawLeadsPerQualified', parseFloat(e.target.value) || 0)}
                                    placeholder="10"
                                />
                            </div>
                            <div className="input-group">
                                <label>Minutes per raw lead touch?</label>
                                <input
                                    type="number"
                                    value={data.prospectingTimeMinutes || ''}
                                    onChange={e => updateData('prospectingTimeMinutes', parseFloat(e.target.value) || 0)}
                                    placeholder="5"
                                />
                            </div>
                        </div>
                        <div className="grid">
                            <div className="input-group">
                                <label>Qualified Leads for 1 Sale?</label>
                                <input
                                    type="number"
                                    value={data.qualifiedPerSale || ''}
                                    onChange={e => updateData('qualifiedPerSale', parseFloat(e.target.value) || 0)}
                                    placeholder="5"
                                />
                            </div>
                            <div className="input-group">
                                <label>Minutes to qualify a lead?</label>
                                <input
                                    type="number"
                                    value={data.qualificationTimeMinutes || ''}
                                    onChange={e => updateData('qualificationTimeMinutes', parseFloat(e.target.value) || 0)}
                                    placeholder="15"
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Time for final closing call? (Hours)</label>
                            <input
                                type="number"
                                value={data.closingMeetingTimeHours || ''}
                                onChange={e => updateData('closingMeetingTimeHours', parseFloat(e.target.value) || 0)}
                                placeholder="3"
                            />
                        </div>
                        <div className="btn-row">
                            <button className="btn btn-ghost" onClick={prevStep}>Back</button>
                            <button className="btn btn-primary" onClick={() => onComplete(data)}>Generate Business Model</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="card wizard-container">
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>
            {renderStep()}
        </div>
    );
};

export default Wizard;
