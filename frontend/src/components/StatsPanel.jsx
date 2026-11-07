export default function StatsPanel({ total, years, filieres }) {
  const max = Math.max(1, ...years.map((row) => row.count))
  const peak = years.reduce((best, row) => (row.count > (best?.count ?? 0) ? row : best), null)

  return (
    <section className="stats">
      <article className="stat">
        <span className="stat-label">Étudiants</span>
        <strong className="stat-value">{total}</strong>
        <span className="stat-foot">enregistrés en base</span>
      </article>

      <article className="stat">
        <span className="stat-label">Filières</span>
        <strong className="stat-value">{filieres}</strong>
        <span className="stat-foot">parcours distincts</span>
      </article>

      <article className="stat">
        <span className="stat-label">Année phare</span>
        <strong className="stat-value">{peak ? peak.year : '—'}</strong>
        <span className="stat-foot">
          {peak ? `${peak.count} naissance${peak.count > 1 ? 's' : ''}` : 'aucune donnée'}
        </span>
      </article>

      <article className="stat wide">
        <div className="stat-head">
          <span className="stat-label">Répartition par année de naissance</span>
          <span className="stat-foot">GET /students/byYear</span>
        </div>

        {years.length === 0 ? (
          <p className="stat-foot">Pas encore de statistiques.</p>
        ) : (
          <ul className="bars">
            {years.map((row) => (
              <li key={row.year}>
                <span className="bar-year">{row.year}</span>
                <span className="bar-track">
                  <span className="bar-fill" style={{ width: `${(row.count / max) * 100}%` }} />
                </span>
                <span className="bar-count">{row.count}</span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  )
}
