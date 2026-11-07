const BASE = '/api'

async function call(path, options = {}) {
  const response = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Ressource introuvable')
    }
    if (response.status === 400) {
      throw new Error('Données invalides, vérifie les champs du formulaire')
    }
    throw new Error(`Erreur serveur (${response.status})`)
  }

  if (response.status === 204) {
    return null
  }

  const type = response.headers.get('content-type') || ''
  return type.includes('application/json') ? response.json() : null
}

export function listStudents() {
  return call('/students/all')
}

export function addStudent(student) {
  return call('/students/save', {
    method: 'POST',
    body: JSON.stringify(student)
  })
}

export function removeStudent(id) {
  return call(`/students/delete/${id}`, { method: 'DELETE' })
}

export function countStudents() {
  return call('/students/count')
}

export function studentsByYear() {
  return call('/students/byYear')
}
