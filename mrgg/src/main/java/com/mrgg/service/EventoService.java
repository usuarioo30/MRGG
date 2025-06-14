package com.mrgg.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrgg.entity.EstadoEvento;
import com.mrgg.entity.EstadoSolicitud;
import com.mrgg.entity.Evento;
import com.mrgg.entity.Juego;
import com.mrgg.entity.Solicitud;
import com.mrgg.entity.Usuario;
import com.mrgg.repository.EventoRepository;
import com.mrgg.repository.JuegoRepository;
import com.mrgg.repository.SolicitudRepository;
import com.mrgg.security.JWTUtils;

import jakarta.transaction.Transactional;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private JuegoRepository juegoRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Transactional
    public Evento saveEventoBySolicitud(Evento evento) {
        Evento eventoGuardado = eventoRepository.save(evento);

        return eventoGuardado;
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
                Evento eventoActual = eventoO.get();

                if (evento.getNum_jugadores() != null) {
                    eventoActual.setNum_jugadores(evento.getNum_jugadores());
                }
                if (evento.getEstado() != null) {
                    eventoActual.setEstado(evento.getEstado());
                }
                if (evento.getDescripcion() != null) {
                    eventoActual.setDescripcion(evento.getDescripcion());
                }
                if (evento.getFecha_inicio() != null) {
                    eventoActual.setFecha_inicio(evento.getFecha_inicio());
                }

                return eventoRepository.save(eventoActual);
            }
        }
        return null;
    }

    @Transactional
    public boolean deleteEvento(Integer id) {
        Usuario usuario = jwtUtils.userLogin();
        Optional<Evento> eventoOpt = eventoRepository.findById(id);

        if (eventoOpt.isPresent() && eventoOpt.get().getUsuario().equals(usuario)) {
            Evento evento = eventoOpt.get();

            Set<Solicitud> solicitudes = evento.getSolicitudes();
            if (solicitudes != null && !solicitudes.isEmpty()) {
                solicitudes.forEach(solicitud -> {
                    solicitud.setEstado(EstadoSolicitud.CANCELADA);
                    solicitudRepository.save(solicitud);
                });
            }

            eventoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean cancelarEvento(Integer id) {
        Usuario usuario = jwtUtils.userLogin();
        Optional<Evento> eventoOpt = eventoRepository.findById(id);

        if (eventoOpt.isPresent() && eventoOpt.get().getUsuario().equals(usuario)) {
            Evento evento = eventoOpt.get();

            Set<Solicitud> solicitudes = evento.getSolicitudes();
            if (solicitudes != null && !solicitudes.isEmpty()) {
                solicitudes.forEach(solicitud -> {
                    solicitud.setEstado(EstadoSolicitud.CANCELADA);
                    solicitudRepository.save(solicitud);
                });
            }

            evento.setEstado(EstadoEvento.CANCELADO);
            eventoRepository.save(evento);

            return true;
        }

        return false;
    }

    public Evento findBySolicitudId(int idSolicitud) {
        Evento res = null;
        Optional<Evento> eventoO = eventoRepository.findBySolicitudId(idSolicitud);
        if (eventoO.isPresent()) {
            res = eventoO.get();
        }
        return res;
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
