export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center py-10">
      <div className={`${sizes[size]} border-4 border-primary border-t-transparent rounded-full animate-spin`} />
    </div>
  );
}