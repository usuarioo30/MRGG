package com.mrgg.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mrgg.entity.Evento;
import com.mrgg.entity.Usuario;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Integer> {
    public List<Evento> findByJuegosId(Integer idJuego);

    @Query("SELECT COUNT(e) FROM Evento e WHERE e.juegos.id = :juegoId")
    int contarEventosPorJuego(@Param("juegoId") Long juegoId);

    @Query("SELECT e FROM Evento e WHERE e.usuario.id = ?1")
    Set<Evento> getAllEventosByUsuario(Usuario u);
}
