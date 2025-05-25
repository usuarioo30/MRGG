package com.mrgg.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mrgg.entity.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    public Optional<Usuario> findByUsername(String username);

    @Query("SELECT u FROM Usuario u JOIN u.solicitudes s WHERE s.id = ?1")
    public Optional<Usuario> findUserBySolicitud(int id);

    public Optional<Usuario> findByClaveSegura(String claveSegura);

    public Optional<Usuario> findByEmail(String email);
}
