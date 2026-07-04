interface NamespaceSelectProps {
  value: string;
  options: string[];
  onChange: (namespace: string) => void;
}

// UI: presentational namespace dropdown. Receives options + value, emits the
// chosen namespace. No store access.
export default function NamespaceSelect({
  value,
  options,
  onChange,
}: NamespaceSelectProps) {
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="section-title">Namespace</div>
      {/*
        The custom chevron arrow is a data-URI SVG — kept as bg-image because
        Tailwind has no utility for arbitrary background-image SVG content.
      */}
      <select
        className="w-full py-[7px] pl-[10px] pr-7 bg-surface border border-border-strong rounded-md text-text-primary text-xs cursor-pointer outline-none appearance-none transition-colors duration-150 focus:border-primary"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%234a5568' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">All namespaces</option>
        {options.map((ns) => (
          <option key={ns} value={ns}>
            {ns}
          </option>
        ))}
      </select>
    </div>
  );
}
