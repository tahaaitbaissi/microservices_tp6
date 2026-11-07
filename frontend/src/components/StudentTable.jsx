import { formatDate, initials } from '../format.js'

export default function StudentTable({ students, loading, deletingId, onDelete }) {
  if (loading) {
    return (
      <div className="rows">
        {[0, 1, 2, 3].map((row) => (
          <div className="row skeleton" key={row}>
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="empty">
        <div className="empty-mark">∅</div>
        <h3>Aucun étudiant</h3>
        <p>Ajoute un premier étudiant avec le formulaire à gauche.</p>
      </div>
    )
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Étudiant</th>
            <th>Naissance</th>
            <th>Filière</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <div className="who">
                  <span className="avatar">{initials(student)}</span>
                  <span>
                    <strong>
                      {student.nom} {student.prenom}
                    </strong>
                    <small>#{student.id}</small>
                  </span>
                </div>
              </td>
              <td className="muted">{formatDate(student.dateNaissance)}</td>
              <td>
                <span className="chip">{student.filiere || 'Non renseignée'}</span>
              </td>
              <td className="right">
                <button
                  className="ghost danger"
                  onClick={() => onDelete(student)}
                  disabled={deletingId === student.id}
                >
                  {deletingId === student.id ? 'Suppression…' : 'Supprimer'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
