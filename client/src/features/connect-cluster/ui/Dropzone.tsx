import { useRef, useState } from "react";

interface DropzoneProps {
  onFile: (file: File) => void;
}

// UI: kubeconfig drop target. Owns only its local hover styling and the DOM
// plumbing for file selection; hands the chosen file upward via `onFile`.
export default function Dropzone({ onFile }: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <>
      <div
        className={`border-[1.5px] border-dashed rounded-lg px-4 py-7 text-center cursor-pointer outline-none transition-colors duration-150 ${
          isDragOver
            ? "border-primary bg-primary/[0.05]"
            : "border-border-strong bg-transparent hover:border-primary hover:bg-primary/[0.05]"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={openPicker}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && openPicker()}
      >
        <div className="text-2xl mb-2 text-text-muted">⬆</div>
        <div className="text-xs text-text-secondary leading-relaxed">
          Drop kubeconfig here
          <br />
          or click to browse
        </div>
        <div className="text-11 text-text-muted mt-[6px]">
          ~/.kube/config or any kubeconfig file
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleInputChange}
        accept="*/*"
      />
    </>
  );
}
