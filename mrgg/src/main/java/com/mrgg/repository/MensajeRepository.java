package com.mrgg.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrgg.entity.Mensaje;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Integer> {
}
