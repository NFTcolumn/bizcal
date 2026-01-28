import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import type { WizardData } from '../types/wizard';

interface AIStrategistProps {
    data: WizardData;
    metrics: any;
}

const AIStrategist: React.FC<AIStrategistProps> = ({ data, metrics }) => {
    const [insight, setInsight] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateInsight = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                You are a world-class business strategist and financial advisor.
                Analyze the following business model and provide a concise, high-impact "Reality Check" and 3 specific, actionable recommendations to optimize the model.
                
                CURRENT NUMBERS:
                - Yearly Profit Goal: $${data.yearlyIncomeGoal.toLocaleString()}
                - Weekly Work Hours: ${data.weeklyWorkHours} hrs
                - Recommended Price to hit goal: $${metrics.recommendedPrice.toLocaleString()}
                - Time to Make Unit: ${data.productionTime} hrs
                - Total Sales Time per Unit: ${metrics.totalSalesTimePerSale.toFixed(1)} hrs
                - Sales Time Percentage: ${metrics.salesTimePercentage}% of total time
                - Effective Hourly Rate: $${metrics.effectiveHourlyRate.toFixed(2)}/hr
                
                CHALLENGES:
                - If the recommended price is very high, they might have a market fit issue.
                - If sales time % is high, they are spending too much time hunting and not enough building.
                - If effective hourly rate is low, the business model is weak.

                OUTPUT FORMAT:
                1. A 2-sentence "Strategist's Verdict" (Bold and direct).
                2. Three bullets under the header "Move These Levers":
                   - Focus on what specific number needs to move (e.g., "Cut production time by 20%" or "Increase prospecting efficiency").
                   - explain WHY based on the math.
                
                Keep it under 150 words. Be sharp, professional, and data-driven.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            setInsight(response.text());
        } catch (err) {
            console.error(err);
            setError("Failed to consult the AI strategist. Check your connection or API key.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        generateInsight();
    }, []);

    return (
        <div className="card ai-strategist-card" style={{ marginTop: '2rem', border: '1px solid rgba(168, 85, 247, 0.4)', background: 'rgba(168, 85, 247, 0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a855f7' }}>
                    <Sparkles size={24} />
                    AI Strategist Analysis
                </h3>
                <button
                    className="btn btn-ghost"
                    onClick={generateInsight}
                    disabled={isLoading}
                    style={{ padding: '0.5rem', borderRadius: '50%' }}
                >
                    <RefreshCw size={18} className={isLoading ? 'spin' : ''} />
                </button>
            </div>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <div className="loader"></div>
                    </motion.div>
                ) : error ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <AlertCircle size={18} />
                        {error}
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '0.95rem', lineHeight: '1.6' }}
                    >
                        <div className="ai-content-markdown">
                            {insight.split('\n').map((line, i) => {
                                if (line.startsWith('**') || line.startsWith('1.') || line.startsWith('###')) {
                                    return <p key={i} style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{line.replace(/\*+/g, '')}</p>
                                }
                                return <p key={i} style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{line}</p>
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .loader {
                    width: 24px;
                    height: 24px;
                    border: 3px solid rgba(168, 85, 247, 0.2);
                    border-top-color: #a855f7;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                .ai-content-markdown p { margin-bottom: 0.75rem; }
            `}</style>
        </div>
    );
};

export default AIStrategist;
