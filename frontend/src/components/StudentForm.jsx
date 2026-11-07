import { useState } from 'react'

const EMPTY = { nom: '', prenom: '', dateNaissance: '', filiere: '' }

export default function StudentForm({ onCreate, busy }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  function update(field) {
    return (event) => {
      setForm({ ...form, [field]: event.target.value })
      setErrors({ ...errors, [field]: undefined })
    }
  }

  function validate() {
    const found = {}
    if (!form.nom.trim()) found.nom = 'Nom obligatoire'
    if (!form.prenom.trim()) found.prenom = 'Prénom obligatoire'
    if (!form.dateNaissance) {
      found.dateNaissance = 'Date obligatoire'
    } else if (new Date(form.dateNaissance) > new Date()) {
      found.dateNaissance = 'La date doit être passée'
    }
    return found
  }

  async function submit(event) {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const done = await onCreate({
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      dateNaissance: `${form.dateNaissance}T00:00:00.000Z`,
      filiere: form.filiere.trim() || null
    })

    if (done) setForm(EMPTY)
  }

  return (
    <form className="student-form" onSubmit={submit} noValidate>
      <div className="panel-heading">
        <span className="eyebrow">Nouveau</span>
        <h2>Inscrire un étudiant</h2>
      </div>

      <label className="field">
        <span>Nom</span>
        <input
          value={form.nom}
          onChange={update('nom')}
          placeholder="El Amrani"
          autoComplete="family-name"
        />
        {errors.nom && <em className="field-error">{errors.nom}</em>}
      </label>

      <label className="field">
        <span>Prénom</span>
        <input
          value={form.prenom}
          onChange={update('prenom')}
          placeholder="Yassine"
          autoComplete="given-name"
        />
        {errors.prenom && <em className="field-error">{errors.prenom}</em>}
      </label>

      <label className="field">
        <span>Date de naissance</span>
        <input type="date" value={form.dateNaissance} onChange={update('dateNaissance')} />
        {errors.dateNaissance && <em className="field-error">{errors.dateNaissance}</em>}
      </label>

      <label className="field">
        <span>Filière</span>
        <input
          value={form.filiere}
          onChange={update('filiere')}
          placeholder="Génie Logiciel"
          list="filieres"
        />
        <datalist id="filieres">
          <option value="Génie Logiciel" />
          <option value="Data Science" />
          <option value="Réseaux" />
          <option value="Cybersécurité" />
        </datalist>
      </label>

      <button className="primary" type="submit" disabled={busy}>
        {busy ? 'Enregistrement…' : 'Ajouter l’étudiant'}
      </button>
      <p className="hint">Les champs nom, prénom et date sont obligatoires.</p>
    </form>
  )
}
