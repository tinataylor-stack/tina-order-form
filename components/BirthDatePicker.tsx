"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, parse } from "date-fns";
import { enGB } from "date-fns/locale";

type BirthDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function BirthDatePicker({
  value,
  onChange,
}: BirthDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | undefined>(
    value ? parse(value, "dd/MM/yyyy", new Date()) : undefined
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultMonth = selected ?? new Date(2000, 0);

  return (
    <div className="relative text-gray-900" ref={wrapperRef}>
      <label className="mb-1 block text-gray-900">วัน/เดือน/ปีเกิด</label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-md border border-gray-300 bg-white p-2 text-left text-gray-900"
      >
        {value || "เลือกวัน/เดือน/ปีเกิด"}
      </button>

      {open && (
        <div className="absolute z-20 mt-2 rounded-md border border-gray-300 bg-white p-3 text-gray-900 shadow-lg">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (!date) return;
              setSelected(date);
              onChange(format(date, "dd/MM/yyyy", { locale: enGB }));
              setOpen(false);
            }}
            month={defaultMonth}
            onMonthChange={setSelected}
            captionLayout="dropdown"
            startMonth={new Date(1940, 0)}
            endMonth={new Date()}
            locale={enGB}
          />
        </div>
      )}
    </div>
  );
}
