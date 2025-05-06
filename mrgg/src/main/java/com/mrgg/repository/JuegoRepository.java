package com.mrgg.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrgg.entity.Juego;
import com.mrgg.entity.TipoCategoria;

@Repository
public interface JuegoRepository extends JpaRepository<Juego, Integer> {
    List<Juego> findByCategoria(TipoCategoria categoria);
}
