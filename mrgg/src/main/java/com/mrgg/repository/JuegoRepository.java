package com.mrgg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrgg.entity.Juego;

@Repository
public interface JuegoRepository extends JpaRepository<Juego, Integer> {

}
