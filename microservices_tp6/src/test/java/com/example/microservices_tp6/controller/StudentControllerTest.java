package com.example.microservices_tp6.controller;

import com.example.microservices_tp6.entity.Student;
import com.example.microservices_tp6.service.StudentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.sql.Date;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentControllerTest {

    @Mock
    private StudentService service;

    @InjectMocks
    private StudentController controller;

    private Student etudiant(String nom, String prenom) {
        return new Student(nom, prenom, Date.valueOf("2004-03-18"), "Genie Logiciel");
    }

    @Test
    @DisplayName("POST /students/save renvoie 201 avec l'etudiant enregistre")
    void enregistrerRetourneCreated() {
        Student demande = etudiant("Yassine", "El Amrani");
        demande.setId(7L);
        when(service.enregistrer(any(Student.class))).thenReturn(demande);

        ResponseEntity<Student> reponse = controller.save(demande);

        assertEquals(HttpStatus.CREATED, reponse.getStatusCode());
        assertEquals("Yassine", reponse.getBody().getNom());
        assertEquals(7L, reponse.getBody().getId());
        verify(service).enregistrer(demande);
    }

    @Test
    @DisplayName("DELETE /students/delete/{id} renvoie 204 quand l'etudiant existe")
    void supprimerRetourneNoContent() {
        when(service.supprimer(7L)).thenReturn(true);

        ResponseEntity<Void> reponse = controller.delete(7L);

        assertEquals(HttpStatus.NO_CONTENT, reponse.getStatusCode());
        assertNull(reponse.getBody());
    }

    @Test
    @DisplayName("DELETE /students/delete/{id} renvoie 404 quand l'etudiant est absent")
    void supprimerRetourneNotFound() {
        when(service.supprimer(99L)).thenReturn(false);

        ResponseEntity<Void> reponse = controller.delete(99L);

        assertEquals(HttpStatus.NOT_FOUND, reponse.getStatusCode());
        verify(service, never()).lister();
    }

    @Test
    @DisplayName("GET /students/all renvoie la liste complete")
    void listerRetourneLesEtudiants() {
        List<Student> attendus = Arrays.asList(
                etudiant("Salma", "Bennani"),
                etudiant("Omar", "Tazi"));
        when(service.lister()).thenReturn(attendus);

        ResponseEntity<List<Student>> reponse = controller.findAll();

        assertEquals(HttpStatus.OK, reponse.getStatusCode());
        assertEquals(2, reponse.getBody().size());
        assertEquals("Bennani", reponse.getBody().get(0).getPrenom());
    }

    @Test
    @DisplayName("GET /students/count renvoie le total")
    void totalRetourneLeNombre() {
        when(service.total()).thenReturn(12L);

        ResponseEntity<Long> reponse = controller.count();

        assertEquals(HttpStatus.OK, reponse.getStatusCode());
        assertEquals(12L, reponse.getBody());
    }

    @Test
    @DisplayName("GET /students/byYear renvoie la repartition par annee")
    void repartitionRetourneLesAnnees() {
        Collection<Object[]> stats = Collections.singletonList(new Object[]{2004, 5L});
        when(service.repartitionParAnnee()).thenReturn(stats);

        ResponseEntity<Collection<?>> reponse = controller.byYear();

        assertEquals(HttpStatus.OK, reponse.getStatusCode());
        assertEquals(1, reponse.getBody().size());
    }
}
