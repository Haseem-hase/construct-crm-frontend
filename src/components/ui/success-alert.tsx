import React, { useEffect, useState } from 'react';

interface SuccessAlertProps {
  title: string;
  description: string;
  show: boolean;
}

export function SuccessAlert({ title, description, show }: SuccessAlertProps) {
  const [render, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  if (!render) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 max-w-[calc(100vw-2rem)] w-full sm:w-[380px]"
    >
      <style>{`
        @keyframes slideInFade {
          0% { opacity: 0; transform: translateY(-10px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideOutFade {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-10px) scale(0.98); }
        }
        .animate-success-alert-in {
          animation: slideInFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-success-alert-out {
          animation: slideOutFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div
        onAnimationEnd={onAnimationEnd}
        className={`bg-white border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[14px] p-4 flex items-start space-x-3 ${
          show ? 'animate-success-alert-in' : 'animate-success-alert-out'
        }`}
      >
        <div className="flex-shrink-0 mt-0.5">
          <svg 
            className="w-5 h-5 text-emerald-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-neutral-900 leading-tight">
            {title}
          </p>
          <p className="text-[13px] text-neutral-500 mt-1 leading-snug">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
