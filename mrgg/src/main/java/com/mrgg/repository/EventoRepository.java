package com.mrgg.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mrgg.entity.Evento;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Integer> {
    public List<Evento> findByJuegosId(Integer idJuego);

    @Query("SELECT COUNT(e) FROM Evento e WHERE e.juegos.id = :juegoId")
    int contarEventosPorJuego(@Param("juegoId") Long juegoId);

}
