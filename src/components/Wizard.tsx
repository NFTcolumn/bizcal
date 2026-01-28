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
                                <label>Production Cost (Materials)</label>
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
                                <label>Shipping / Variable Cost</label>
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
                        </div>
                        <div className="input-group">
                            <label>How long does it take to create one unit? (Hours)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={data.productionTime || ''}
                                onChange={e => updateData('productionTime', parseFloat(e.target.value) || 0)}
                                placeholder="2.0"
                            />
                        </div>
                        <button className="btn btn-primary" onClick={nextStep}>Next: Business Capacity</button>
                    </div>
                );
            case 2:
                return (
                    <div className="wizard-step">
                        <h2>Business Capacity</h2>
                        <div className="input-group">
                            <label>How many hours will you work per week?</label>
                            <input
                                type="number"
                                value={data.weeklyWorkHours || ''}
                                onChange={e => updateData('weeklyWorkHours', parseFloat(e.target.value) || 0)}
                                placeholder="40"
                            />
                        </div>
                        <div className="input-group">
                            <label>What is your annual net profit goal?</label>
                            <div className="input-wrapper">
                                <span>$</span>
                                <input
                                    type="number"
                                    value={data.yearlyIncomeGoal || ''}
                                    onChange={e => updateData('yearlyIncomeGoal', parseFloat(e.target.value) || 0)}
                                    placeholder="100000"
                                />
                            </div>
                        </div>
                        <div className="btn-row">
                            <button className="btn btn-ghost" onClick={prevStep}>Back</button>
                            <button className="btn btn-primary" onClick={nextStep}>Next: Pricing</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="wizard-step">
                        <h2>Pricing & Volume</h2>
                        <div className="input-group">
                            <label>Planned Sales Price (per unit)</label>
                            <div className="input-wrapper">
                                <span>$</span>
                                <input
                                    type="number"
                                    value={data.unitPrice || ''}
                                    onChange={e => updateData('unitPrice', parseFloat(e.target.value) || 0)}
                                    placeholder="500"
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
                        <h2>Sales Funnel Logic</h2>
                        <div className="grid">
                            <div className="input-group">
                                <label>Raw Leads to find 1 Qualified?</label>
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
                            <label>Time for final closing session? (Hours)</label>
                            <input
                                type="number"
                                value={data.closingMeetingTimeHours || ''}
                                onChange={e => updateData('closingMeetingTimeHours', parseFloat(e.target.value) || 0)}
                                placeholder="3"
                            />
                        </div>
                        <div className="btn-row">
                            <button className="btn btn-ghost" onClick={prevStep}>Back</button>
                            <button className="btn btn-primary" onClick={() => {
                                const unitProfit = data.unitPrice - (data.productionCost + data.shippingCost);
                                const volumeNeeded = Math.ceil(data.yearlyIncomeGoal / (unitProfit > 0 ? unitProfit : 1));
                                onComplete({ ...data, targetVolume: volumeNeeded });
                            }}>Generate Plan</button>
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
