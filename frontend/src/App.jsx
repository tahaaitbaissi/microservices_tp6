import { useEffect, useMemo, useState } from 'react'
import {
  addStudent,
  countStudents,
  listStudents,
  removeStudent,
  studentsByYear
} from './api.js'
import { normalizeYears } from './format.js'
import StudentForm from './components/StudentForm.jsx'
import StudentTable from './components/StudentTable.jsx'
import StatsPanel from './components/StatsPanel.jsx'

export default function App() {
  const [students, setStudents] = useState([])
  const [total, setTotal] = useState(0)
  const [years, setYears] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const [liste, nombre, repartition] = await Promise.all([
        listStudents(),
        countStudents(),
        studentsByYear()
      ])
      setStudents(liste ?? [])
      setTotal(nombre ?? (liste?.length ?? 0))
      setYears(normalizeYears(repartition))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(''), 3500)
    return () => clearTimeout(timer)
  }, [notice])

  async function handleCreate(etudiant) {
    setBusy(true)
    setError('')
    try {
      await addStudent(etudiant)
      setNotice(`${etudiant.prenom} ${etudiant.nom} a été ajouté.`)
      await refresh()
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(etudiant) {
    const ok = window.confirm(`Supprimer ${etudiant.prenom} ${etudiant.nom} ?`)
    if (!ok) return

    setDeletingId(etudiant.id)
    setError('')
    try {
      await removeStudent(etudiant.id)
      setNotice('Étudiant supprimé.')
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const filieres = useMemo(
    () => new Set(students.map((s) => s.filiere).filter(Boolean)).size,
    [students]
  )

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    if (!needle) return students
    return students.filter((s) =>
      [s.nom, s.prenom, s.filiere].filter(Boolean).some((value) =>
        value.toLowerCase().includes(needle)
      )
    )
  }, [students, search])

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">É</span>
          <div>
            <strong>Gestion des étudiants</strong>
            <small>Spring Boot · React</small>
          </div>
        </div>
        <div className="topbar-actions">
          <span className={`status ${error ? 'offline' : 'online'}`}>
            <i /> {error ? 'API indisponible' : 'API connectée'}
          </span>
          <button className="ghost" onClick={refresh} disabled={loading}>
            {loading ? 'Chargement…' : 'Actualiser'}
          </button>
        </div>
      </header>

      <main className="shell">
        <section className="hero">
          <div>
            <h1>Tous vos étudiants, en un coup d’œil.</h1>
            <p>
              Ajoutez, filtrez et supprimez les inscrits. Les statistiques se recalculent depuis
              l’API à chaque modification.
            </p>
          </div>
          <div className="hero-badge">
            <span>Total</span>
            <strong>{total}</strong>
          </div>
        </section>

        {error && (
          <div className="banner error">
            <strong>Impossible de joindre l’API.</strong>
            <span>{error}. Vérifie que le backend tourne sur http://localhost:8080.</span>
          </div>
        )}

        <div className="layout">
          <aside className="panel">
            <StudentForm onCreate={handleCreate} busy={busy} />
          </aside>

          <div className="stack">
            <StatsPanel total={total} years={years} filieres={filieres} />

            <section className="panel table-panel">
              <div className="panel-heading row-heading">
                <div>
                  <span className="eyebrow">Liste</span>
                  <h2>Étudiants inscrits</h2>
                </div>
                <div className="toolbar">
                  <input
                    className="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher un nom, une filière…"
                    aria-label="Rechercher"
                  />
                  <span className="count-chip">{filtered.length}</span>
                </div>
              </div>

              <StudentTable
                students={filtered}
                loading={loading}
                deletingId={deletingId}
                onDelete={handleDelete}
              />
            </section>
          </div>
        </div>
      </main>

      <footer className="foot">
        <span>POST /students/save</span>
        <span>GET /students/all</span>
        <span>GET /students/count</span>
        <span>GET /students/byYear</span>
        <span>DELETE /students/delete/&#123;id&#125;</span>
      </footer>

      {notice && <div className="toast">{notice}</div>}
    </div>
  )
}
