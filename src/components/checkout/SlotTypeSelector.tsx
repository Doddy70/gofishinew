"use client";

import { LuSun, LuSunset, LuMoon, LuClock } from "react-icons/lu";

export type SlotType = "MORNING_STRIKE" | "FULL_DAY" | "CHARTER_2D1N" | "CUSTOM";

interface SlotTypeSelectorProps {
  value: SlotType;
  onChange: (slot: SlotType) => void;
  disabled?: boolean;
}

const SLOT_TYPES = [
  {
    id: "MORNING_STRIKE" as SlotType,
    label: "Morning Strike",
    time: "04:00 - 12:00",
    icon: <LuSun size={20} />,
    description: "Pagi hari - sore hari",
  },
  {
    id: "FULL_DAY" as SlotType,
    label: "Full Day",
    time: "04:00 - 17:00",
    icon: <LuSun size={20} />,
    description: "Pagi - sore hari (Full Day Charter",
  },
  {
    id: "CHARTER_2D1N" as SlotType,
    time: "48 jam",
    icon: <LuMoon size={20} />,
    label: "2D1N Trip",
    description: "Tidur di kapal",
  },
  {
    id: "CUSTOM" as SlotType,
    label: "Custom",
    time: "Custom",
    icon: <LuClock size={20} />,
    description: "Atur jam keberangkatan sendiri",
  },
];

export default function SlotTypeSelector({ value, onChange, disabled }: SlotTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Tipe Trip
      </label>
      <div className="grid grid-cols-2 gap-3">
        {SLOT_TYPES.map((slot) => (
          <button
            key={slot.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(slot.id)}
            className={`
              p-4 rounded-xl border-2 transition-all text-left
              ${value === slot.id
                ? "border-[var(--color-primary)] bg-[var(--color-primary)/5] ring-1 ring-[var(--color-primary)]"
                : "border-gray-200 hover:border-gray-300"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              {slot.icon}
              <span className="font-semibold text-sm">{slot.label}</span>
            </div>
            <p className="text-xs text-gray-500 ml-7">{slot.time}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
