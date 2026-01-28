import React, { useState, useEffect, useRef } from 'react';

interface TaskTimerProps {
    onTimeUpdate: (seconds: number) => void;
    initialTime?: number;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ onTimeUpdate, initialTime = 0 }) => {
    const [seconds, setSeconds] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef<any>(null);

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive]);

    useEffect(() => {
        onTimeUpdate(seconds);
    }, [seconds, onTimeUpdate]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setSeconds(0);
    };

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <span className="metric-label">Production Timer</span>
            <div style={{ fontSize: '3rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
                {formatTime(seconds)}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                    className={`btn ${isActive ? 'btn-ghost' : 'btn-primary'}`}
                    onClick={toggleTimer}
                    style={{ minWidth: '100px' }}
                >
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button className="btn btn-ghost" onClick={resetTimer}>
                    Reset
                </button>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {(seconds / 3600).toFixed(2)} total hours tracked
            </span>
        </div>
    );
};

export default TaskTimer;
