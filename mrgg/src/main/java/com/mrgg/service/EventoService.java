package com.mrgg.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrgg.entity.EstadoEvento;
import com.mrgg.entity.Evento;
import com.mrgg.entity.Juego;
import com.mrgg.entity.Usuario;
import com.mrgg.repository.EventoRepository;
import com.mrgg.repository.JuegoRepository;
import com.mrgg.security.JWTUtils;

import jakarta.transaction.Transactional;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private JuegoRepository juegoRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Transactional
    public Evento saveEvento(Evento evento) {
        Usuario usuario = jwtUtils.userLogin();
        evento.setUsuario(usuario);
        Evento eventoSave = eventoRepository.save(evento);

        return eventoSave;
    }

    @Transactional
    public Evento saveEventoPorJuego(Evento evento, Integer juegoId) {
        Optional<Juego> juegoOpt = juegoRepository.findById(juegoId);

        if (juegoOpt.isEmpty()) {
            return null;
        }

        Usuario usuario = jwtUtils.userLogin();
        evento.setJuego(juegoOpt.get());

        String codigoSala = UUID.randomUUID().toString().substring(0, 8);
        evento.setCodigo_sala(codigoSala);
        evento.setEstado(EstadoEvento.ABIERTO);
        evento.setUsuario(usuario);

        Evento eventoGuardado = eventoRepository.save(evento);

        return eventoGuardado;
    }

    @Transactional
    public Evento updateEvento(int id, Evento evento) {
        Optional<Evento> eventoO = eventoRepository.findById(id);
        if (eventoO.isPresent()) {
            Usuario usuario = jwtUtils.userLogin();
            if (usuario != null && eventoO.get().getUsuario().equals(usuario)) {
                eventoO.get().setNum_jugadores(evento.getNum_jugadores());
                eventoO.get().setEstado(evento.getEstado());
                eventoO.get().setDescripcion(evento.getDescripcion());

                return eventoRepository.save(eventoO.get());
            }
        }
        return null;
    }

    @Transactional
    public boolean deleteEvento(Integer id) {
        Usuario usuario = jwtUtils.userLogin();
        Optional<Evento> evento = eventoRepository.findById(id);

        if (evento.isPresent() && evento.get().getUsuario().equals(usuario)) {
            eventoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Evento> getEventoById(int id) {
        return eventoRepository.findById(id);
    }

    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
    }

    public Set<Evento> getAllEventosByUsuario() {
        Usuario usuario = jwtUtils.userLogin();
        return eventoRepository.getAllEventosByUsuario(usuario);
    }

    public List<Evento> getEventosByJuegoId(Integer idJuego) {
        return eventoRepository.findByJuegosId(idJuego);
    }

    public int obtenerCantidadEventosPorJuego(Long juegoId) {
        return eventoRepository.contarEventosPorJuego(juegoId);
    }

    public Usuario getUsuarioByEventoId(int id) {
        Optional<Evento> evento = eventoRepository.findById(id);
        if (evento.isPresent()) {
            return evento.get().getUsuario();
        }
        return null;
    }

}
