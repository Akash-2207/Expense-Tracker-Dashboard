export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="text-center py-16">
      {Icon && <Icon size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />}
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-gray-500 mb-6">{subtitle}</p>
      {action}
    </div>
  );
}