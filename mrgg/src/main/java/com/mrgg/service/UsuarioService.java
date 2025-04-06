package com.mrgg.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrgg.entity.Usuario;
import com.mrgg.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario saveUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario updateUsuario(Usuario usuarioU) {
        Usuario usuarioExistente = usuarioRepository.findById(usuarioU.getId()).orElse(null);
        if (usuarioExistente == null) {

            return null;
        }

        usuarioExistente.setNombre(usuarioU.getNombre());
        usuarioExistente.setCorreo_electronico(usuarioU.getCorreo_electronico());
        usuarioExistente.setFoto(usuarioU.getFoto());
        usuarioExistente.setUsername(usuarioU.getUsername());
        usuarioExistente.setPassword(usuarioU.getPassword());
        usuarioExistente.setBaneado(usuarioU.getBaneado());

        return usuarioRepository.save(usuarioU);
    }

    public void deleteUsuario(int id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario getUsuarioById(int id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Optional<Usuario> getUsuarioByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }
}
