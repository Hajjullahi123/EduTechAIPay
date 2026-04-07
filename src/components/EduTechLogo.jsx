import React from 'react';

const EduTechLogo = ({ size = 40, className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Crimson Shield Base */}
          <path 
            d="M12 2L4 5V11C4 16.18 7.41 21.03 12 22C16.59 21.03 20 16.18 20 11V5L12 2Z" 
            fill="#e11d48" 
          />
          {/* White Graduation Cap Logic */}
          <path 
            d="M12 7L7 10L12 13L17 10L12 7Z" 
            fill="white" 
          />
          <path 
            d="M7 11V14C7 14 9 16 12 16C15 16 17 14 17 14V11L12 14L7 11Z" 
            fill="white" 
          />
          <path 
            d="M18 10V15" 
            stroke="white" 
            strokeLinecap="round" 
            strokeWidth="1.5" 
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`font-black tracking-tighter text-lg leading-none ${className.includes('logo-white-text') ? 'text-white' : 'text-slate-900'}`}>
          EDUTECH
        </span>
        <span className="text-primary font-black text-[8px] uppercase tracking-[3px] mt-1">
          Pro Suite
        </span>
      </div>
    </div>
  );
};

export default EduTechLogo;
