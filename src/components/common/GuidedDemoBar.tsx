import React from 'react';
import { useCineWave, DEMO_STEPS } from '../../context/CineWaveContext';
import { Play, RotateCcw, ChevronRight, CheckCircle2, Sparkles, UserCheck, ShieldCheck, User } from 'lucide-react';

export const GuidedDemoBar: React.FC = () => {
  const { demoStepIndex, nextDemoStep, resetDemoData, isDemoActive, setIsDemoActive, role, setRole, setSelectedCaseId, setActiveTab } = useCineWave();

  if (!isDemoActive) {
    return (
      <div className="bg-slate-900/90 border-b border-slate-800 py-1.5 px-4 text-xs flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Pega Case Management Demo Sandbox</span>
        </div>
        <button
          onClick={() => setIsDemoActive(true)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline flex items-center gap-1"
        >
          <Play className="w-3 h-3" /> Enable Guided Walkthrough Mode
        </button>
      </div>
    );
  }

  const currentStep = DEMO_STEPS[demoStepIndex];

  const handleStepJump = (idx: number) => {
    const stepObj = DEMO_STEPS[idx];
    setRole(stepObj.role);
    setSelectedCaseId('CW-2026-00125');
    if (stepObj.role === 'STAFF') {
      setActiveTab('cases');
    } else if (stepObj.role === 'CUSTOMER') {
      setActiveTab(idx >= 4 ? 'my-bookings' : 'movies');
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/90 border-b border-indigo-500/30 py-2.5 px-4 text-xs shadow-lg shadow-indigo-950/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Step indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-indigo-600/30 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/40 font-semibold uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Guided Demo Step {currentStep.step} of 6
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-bold">{currentStep.title}:</span>
            <span className="text-slate-200 hidden lg:inline">{currentStep.instruction}</span>
          </div>
        </div>

        {/* Step controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1 mr-2 bg-slate-950/50 p-1 rounded-lg border border-slate-800">
            {DEMO_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => handleStepJump(idx)}
                className={`w-6 h-6 rounded text-[11px] font-mono flex items-center justify-center transition-all ${
                  demoStepIndex === idx
                    ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400'
                    : demoStepIndex > idx
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={s.title}
              >
                {demoStepIndex > idx ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.step}
              </button>
            ))}
          </div>

          {demoStepIndex < DEMO_STEPS.length - 1 ? (
            <button
              onClick={() => {
                nextDemoStep();
                handleStepJump(demoStepIndex + 1);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95 text-xs"
            >
              Next Step <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 px-3 py-1 rounded-lg font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Demo Completed!
            </span>
          )}

          <button
            onClick={resetDemoData}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700 transition-colors"
            title="Reset to initial state"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};
