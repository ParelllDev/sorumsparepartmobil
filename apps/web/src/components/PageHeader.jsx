export default function PageHeader({ title, description, children }) {
  return (
    <div className="mb-8 border-b border-slate-200 pb-6">
      <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
      )}
      {children}
    </div>
  );
}