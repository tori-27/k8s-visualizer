// UI: inline connection error message.
export default function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="text-11 text-danger bg-danger/[0.08] border border-danger/20 rounded-[5px] px-[10px] py-2 leading-relaxed">
      {message}
    </div>
  );
}
