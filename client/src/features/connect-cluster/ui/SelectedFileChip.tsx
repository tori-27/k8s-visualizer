// UI: shows the currently picked kubeconfig file name.
export default function SelectedFileChip({ name }: { name: string }) {
  return (
    <div className="text-11 text-text-tertiary bg-surface rounded-[5px] px-[10px] py-[7px] break-all">
      📄 {name}
    </div>
  );
}
