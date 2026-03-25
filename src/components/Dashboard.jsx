import ApplicationCard from './ApplicationCard';

export default function Dashboard({
  applications,
  ghostMetas,
  filter,
  focusedApplicationId,
  onFilterChange,
  onFocus,
  onOpenEmail,
  onStatusChange,
  onDelete
}) {
  return (
    <section>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {['all', 'ghosted', 'cold', 'fresh', 'interviewing'].map((option) => (
          <button
            key={option}
            type="button"
            className={filter === option ? 'primary-btn' : 'secondary-btn'}
            onClick={() => onFilterChange(option)}
          >
            {option === 'all' ? 'All' : option === 'cold' ? 'Getting Cold' : option[0].toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {!applications.length ? (
        <div style={{ background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: 14, padding: '1rem', color: 'var(--text-secondary)' }}>
          No applications match this filter yet. Add one to start tracking ghost risk.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12 }}>
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              ghostMeta={ghostMetas[application.id]}
              isActive={focusedApplicationId === application.id}
              onSelect={() => onFocus(application.id)}
              onOpenEmail={() => onOpenEmail(application)}
              onStatusChange={(status) => onStatusChange(application.id, status)}
              onDelete={() => onDelete(application.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
