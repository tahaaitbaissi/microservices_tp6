package com.example.microservices_tp6.service;

import com.example.microservices_tp6.entity.Student;
import com.example.microservices_tp6.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Student enregistrer(Student etudiant) {
        return repository.save(etudiant);
    }

    @Transactional
    public boolean supprimer(Long id) {
        Optional<Student> trouve = repository.findById(id);
        if (trouve.isEmpty()) {
            return false;
        }
        repository.delete(trouve.get());
        return true;
    }

    @Transactional(readOnly = true)
    public List<Student> lister() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public long total() {
        return repository.count();
    }

    @Transactional(readOnly = true)
    public Collection<Object[]> repartitionParAnnee() {
        return repository.repartitionParAnnee();
    }
}
