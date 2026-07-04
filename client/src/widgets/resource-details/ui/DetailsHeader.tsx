interface DetailsHeaderProps {
  typeName: string;
  onClose: () => void;
}

// UI: details panel header with the resource kind tag and a close button.
export default function DetailsHeader({ typeName, onClose }: DetailsHeaderProps) {
  return (
    <div className="panel-header">
      <div className="flex items-center gap-2">
        <span className="type-tag">{typeName}</span>
      </div>
      <button className="close-btn text-base" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
