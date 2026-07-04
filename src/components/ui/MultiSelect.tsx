"use client";

import { useState } from "react";
import { LuCheck } from "react-icons/lu";

interface MultiSelectProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
}

export default function MultiSelect({
  label,
  value,
  onChange,
  options
}: MultiSelectProps) {
  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="w-full relative">
      <label className="text-sm font-semibold text-ink mb-2 block">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value.includes(option);
          return (
            <div
              key={option}
              onClick={() => toggleOption(option)}
              className={`
                px-4 py-2 rounded-full border cursor-pointer text-sm font-medium transition-all flex items-center gap-2
                ${isSelected 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-default text-muted hover:border-gray-400'
                }
              `}
            >
              {isSelected && <LuCheck size={14} />}
              {option}
            </div>
          );
        })}
      </div>
    </div>
  );
}
