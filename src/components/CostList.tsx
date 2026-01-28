import React from 'react';
import type { CostItem } from '../utils/calculator';

interface CostListProps {
    title: string;
    items: CostItem[];
    onAdd: () => void;
    onUpdate: (id: string, field: 'name' | 'amount', value: string | number) => void;
    onRemove: (id: string) => void;
    placeholder?: string;
}

const CostList: React.FC<CostListProps> = ({ title, items, onAdd, onUpdate, onRemove, placeholder }) => {
    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>{title}</h3>
                <button className="btn btn-ghost" onClick={onAdd} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    + Add Item
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        No items added yet.
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={item.name}
                                placeholder={placeholder || "Equipment, Materials..."}
                                onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
                                style={{ flex: 3 }}
                            />
                            <div style={{ flex: 2, position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</span>
                                <input
                                    type="number"
                                    value={item.amount || ''}
                                    onChange={(e) => onUpdate(item.id, 'amount', parseFloat(e.target.value) || 0)}
                                    style={{ paddingLeft: '1.75rem' }}
                                />
                            </div>
                            <button
                                onClick={() => onRemove(item.id)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
                            >
                                ✕
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CostList;
