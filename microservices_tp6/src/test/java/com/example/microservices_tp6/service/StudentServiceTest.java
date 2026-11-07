package com.example.microservices_tp6.service;

import com.example.microservices_tp6.entity.Student;
import com.example.microservices_tp6.repository.StudentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository repository;

    @InjectMocks
    private StudentService service;

    @Test
    @DisplayName("enregistrer delegue au repository et renvoie l'entite sauvee")
    void enregistrerDelegueAuRepository() {
        Student nouveau = new Student("Yassine", "El Amrani", Date.valueOf("2002-11-05"), "Data Science");
        Student sauve = new Student("Yassine", "El Amrani", Date.valueOf("2002-11-05"), "Data Science");
        sauve.setId(3L);
        when(repository.save(nouveau)).thenReturn(sauve);

        Student resultat = service.enregistrer(nouveau);

        assertEquals(3L, resultat.getId());
        assertEquals("Data Science", resultat.getFiliere());
        verify(repository).save(nouveau);
    }

    @Test
    @DisplayName("supprimer efface l'etudiant trouve")
    void supprimerEffaceExistant() {
        Student trouve = new Student("Salma", "Bennani", Date.valueOf("2003-01-22"), "Reseaux");
        trouve.setId(8L);
        when(repository.findById(8L)).thenReturn(Optional.of(trouve));

        boolean resultat = service.supprimer(8L);

        assertTrue(resultat);
        verify(repository).delete(trouve);
    }

    @Test
    @DisplayName("supprimer renvoie false sans appel delete quand l'id est inconnu")
    void supprimerRetourneFauxSiAbsent() {
        when(repository.findById(404L)).thenReturn(Optional.empty());

        boolean resultat = service.supprimer(404L);

        assertFalse(resultat);
        verify(repository, never()).delete(org.mockito.ArgumentMatchers.any(Student.class));
    }
}
