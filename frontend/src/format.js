export function formatDate(value) {
  if (!value) return '—'
  const raw = String(value).slice(0, 10)
  const [year, month, day] = raw.split('-').map(Number)
  if (!year || !month || !day) return raw
  return new Date(year, month - 1, day).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export function initials(student) {
  const nom = (student.nom || '?').trim().charAt(0)
  const prenom = (student.prenom || '').trim().charAt(0)
  return (prenom + nom).toUpperCase()
}

export function normalizeYears(rows) {
  if (!Array.isArray(rows)) return []
  return rows
    .map((row) => {
      if (Array.isArray(row)) return { year: Number(row[0]), count: Number(row[1]) }
      return { year: Number(row.year ?? row[0]), count: Number(row.count ?? row[1]) }
    })
    .filter((row) => !Number.isNaN(row.year) && !Number.isNaN(row.count))
    .sort((a, b) => a.year - b.year)
}
