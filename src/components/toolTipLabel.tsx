interface TooltipLabelProps {
  label: string;
  tooltip: string;
}

export function TooltipLabel({ label, tooltip }: TooltipLabelProps) {
  return (
    <label className="block font-medium flex items-center gap-2">
      {label}
      <span
        className="relative group inline-block"
      >
        <span
          className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-gray-500 text-white text-xs font-bold cursor-pointer"
        >
          ?
        </span>
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs bg-gray-800 text-white text-xs rounded px-2 py-1 z-10"
        >
          {tooltip}
        </div>
      </span>
    </label>
  );
}
