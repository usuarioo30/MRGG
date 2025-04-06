package com.mrgg.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrgg.entity.Evento;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Integer> {
    public Optional<Evento> findByCategoria(String categoria);
}
