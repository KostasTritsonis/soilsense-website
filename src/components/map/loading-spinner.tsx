export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl shadow-green-100/40 z-30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );
}
