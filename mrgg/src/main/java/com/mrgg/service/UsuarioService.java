package com.mrgg.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mrgg.entity.Roles;
import com.mrgg.entity.Usuario;
import com.mrgg.repository.UsuarioRepository;
import com.mrgg.security.JWTUtils;

import jakarta.transaction.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Usuario saveUsuario(Usuario usuario) {
        usuario.setRol(Roles.USER);
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario updateUsuario(Usuario usuarioU) {
        Usuario usuario = jwtUtils.userLogin();
        if (usuario != null) {
            usuario.setNombre(usuarioU.getNombre());
            usuario.setEmail(usuarioU.getEmail());
            usuario.setFoto(usuarioU.getFoto());
            usuario.setUsername(usuarioU.getUsername());
            usuario.setPassword(usuarioU.getPassword());

            return usuarioRepository.save(usuarioU);
        }

        return null;
    }

    @Transactional
    public boolean deleteUsuario() {
        Usuario usuario = jwtUtils.userLogin();

        if (usuario != null) {
            usuarioRepository.deleteById(usuario.getId());
            return true;
        }

        return false;
    }

    public Optional<Usuario> getUsuarioById(int id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public Optional<Usuario> getUsuarioByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }
}
