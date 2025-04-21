package com.mrgg.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrgg.entity.Evento;
import com.mrgg.entity.Usuario;
import com.mrgg.repository.EventoRepository;
import com.mrgg.security.JWTUtils;

import jakarta.transaction.Transactional;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private UsuarioService usuarioService;

    @Transactional
    public Evento saveEvento(Evento evento) {
        Usuario usuario = jwtUtils.userLogin();
        Evento eventoSave = eventoRepository.save(evento);

        usuario.getEventos().add(eventoSave);

        usuarioService.saveUsuario(usuario);

        return eventoSave;
    }

    @Transactional
    public Evento updateEvento(int id, Evento evento) {
        Optional<Evento> eventoO = eventoRepository.findById(id);
        if (eventoO.isPresent()) {
            Usuario usuario = jwtUtils.userLogin();
            if (usuario != null && usuario.getEventos().contains(evento)) {
                eventoO.get().setNum_usuario(evento.getNum_usuario());
                eventoO.get().setEstado(evento.getEstado());
                eventoO.get().setComentario(evento.getComentario());

                return eventoRepository.save(eventoO.get());
            }
        }
        return null;
    }

    @Transactional
    public boolean deleteEvento(Integer id) {
        Usuario usuario = jwtUtils.userLogin();
        Optional<Evento> evento = eventoRepository.findById(id);

        if (evento.isPresent()) {
            if (usuario.getEventos().contains(evento.get())) {
                eventoRepository.deleteById(id);
                return true;
            }
        }
        return false;
    }

    public Optional<Evento> getEventoById(int id) {
        return eventoRepository.findById(id);
    }

    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
    }

}
