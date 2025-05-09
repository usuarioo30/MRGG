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
        usuario.getEventos().add(eventoGuardado);
        usuarioService.saveUsuarioByEventos(usuario);

        return eventoGuardado;
    }

    @Transactional
    public Evento updateEvento(int id, Evento evento) {
        Optional<Evento> eventoO = eventoRepository.findById(id);
        if (eventoO.isPresent()) {
            Usuario usuario = jwtUtils.userLogin();
            if (usuario != null && usuario.getEventos().contains(evento)) {
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

        if (evento.isPresent() && usuario.getEventos().contains(evento.get())) {
            eventoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean unirseAlEvento(int eventoId) {
        Optional<Evento> eventoOpt = eventoRepository.findById(eventoId);

        if (eventoOpt.isEmpty()) {
            return false;
        }

        Evento evento = eventoOpt.get();

        if (evento.getEstado() != EstadoEvento.ABIERTO) {
            return false;
        }

        Usuario usuario = jwtUtils.userLogin();

        if (usuario.getEventos().contains(evento)) {
            return false;
        }

        usuario.getEventos().add(evento);
        usuarioService.saveUsuario(usuario);

        return true;
    }

    public Optional<Evento> getEventoById(int id) {
        return eventoRepository.findById(id);
    }

    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
    }

    public Set<Evento> getAllEventosByUsuario() {
        Usuario usuario = jwtUtils.userLogin();
        return usuario.getEventos();
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
