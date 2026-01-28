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
        leadsPerSale: 5,
        timePerLead: 0.5,
        unitPrice: 100
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
                        <div className="input-group">
                            <label>How much does it cost to make one product? (Materials)</label>
                            <div className="input-wrapper">
                                <span>$</span>
                                <input
                                    type="number"
                                    value={data.productionCost || ''}
                                    onChange={e => updateData('productionCost', parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>How much does it cost to ship one unit?</label>
                            <div className="input-wrapper">
                                <span>$</span>
                                <input
                                    type="number"
                                    value={data.shippingCost || ''}
                                    onChange={e => updateData('shippingCost', parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={nextStep}>Next: Time & Production</button>
                    </div>
                );
            case 2:
                return (
                    <div className="wizard-step">
                        <h2>Time & Production</h2>
                        <div className="input-group">
                            <label>How long does it take to create one unit? (Hours)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={data.productionTime || ''}
                                onChange={e => updateData('productionTime', parseFloat(e.target.value) || 0)}
                                placeholder="0.0"
                            />
                        </div>
                        <div className="input-group">
                            <label>How many hours will you work per week?</label>
                            <input
                                type="number"
                                value={data.weeklyWorkHours || ''}
                                onChange={e => updateData('weeklyWorkHours', parseFloat(e.target.value) || 0)}
                                placeholder="40"
                            />
                        </div>
                        <div className="btn-row">
                            <button className="btn btn-ghost" onClick={prevStep}>Back</button>
                            <button className="btn btn-primary" onClick={nextStep}>Next: Financial Goals</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="wizard-step">
                        <h2>Financial Goals</h2>
                        <div className="input-group">
                            <label>How much do you want to make per year? (Net Profit)</label>
                            <div className="input-wrapper">
                                <span>$</span>
                                <input
                                    type="number"
                                    value={data.yearlyIncomeGoal || ''}
                                    onChange={e => updateData('yearlyIncomeGoal', parseFloat(e.target.value) || 0)}
                                    placeholder="60000"
                                />
                            </div>
                        </div>
                        <div className="btn-row">
                            <button className="btn btn-ghost" onClick={prevStep}>Back</button>
                            <button className="btn btn-primary" onClick={nextStep}>Next: Sales Funnel</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="wizard-step">
                        <h2>Sales & Outreach</h2>
                        <div className="input-group">
                            <label>How many people do you need to talk to for one sale?</label>
                            <input
                                type="number"
                                value={data.leadsPerSale || ''}
                                onChange={e => updateData('leadsPerSale', parseFloat(e.target.value) || 0)}
                                placeholder="5"
                            />
                        </div>
                        <div className="input-group">
                            <label>How long does each negotiation/lead take? (Hours)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={data.timePerLead || ''}
                                onChange={e => updateData('timePerLead', parseFloat(e.target.value) || 0)}
                                placeholder="0.5"
                            />
                        </div>
                        <div className="btn-row">
                            <button className="btn btn-ghost" onClick={prevStep}>Back</button>
                            <button className="btn btn-primary" onClick={() => onComplete(data)}>Generate Plan</button>
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
                <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
            </div>
            {renderStep()}
        </div>
    );
};

export default Wizard;
