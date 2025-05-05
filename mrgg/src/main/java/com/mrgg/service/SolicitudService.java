package com.mrgg.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.mrgg.entity.EstadoSolicitud;
import com.mrgg.entity.Evento;
import com.mrgg.entity.Solicitud;
import com.mrgg.entity.Usuario;
import com.mrgg.repository.SolicitudRepository;
import com.mrgg.security.JWTUtils;

import jakarta.transaction.Transactional;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private EventoService eventoService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JWTUtils jwtUtils;

    @Transactional
    public Solicitud saveSolicitud(Solicitud solicitud) {
        return solicitudRepository.save(solicitud);
    }

    public Solicitud createSolicitud(Solicitud solicitud, int idEvento) {
        Solicitud res = null;
        Optional<Evento> eventoO = eventoService.getEventoById(idEvento);

        if (!eventoO.isEmpty()) {
            solicitud.setEstado(EstadoSolicitud.PENDIENTE);
            Usuario usuario = jwtUtils.userLogin();

            res = solicitudRepository.save(solicitud);
            usuario.getSolicitudes().add(res);
            usuarioService.saveUsuario(usuario);

            Evento evento = eventoO.get();
            evento.getSolicitudes().add(solicitud);
            eventoService.saveEvento(evento);
        }

        return res;
    }

    public boolean acceptSolicitud(int id) {
        boolean res = false;
        Optional<Solicitud> solicitudO = solicitudRepository.findById(id);
        if (solicitudO.isPresent()) {
            Evento evento = jwtUtils.userLogin();
            if (evento.getSolicitudes().contains(solicitudO.get())) {
                solicitudO.get().setEstado(EstadoSolicitud.ACEPTADA);
                this.saveSolicitud(solicitudO.get());
                res = true;
            }
        }
        return res;
    }

    public boolean refuseSolicitud(int id) {
        boolean res = false;
        Optional<Solicitud> solicitudO = solicitudRepository.findById(id);
        if (solicitudO.isPresent()) {
            Evento evento = jwtUtils.userLogin();
            if (evento.getSolicitudes().contains(solicitudO.get())) {
                solicitudO.get().setEstado(EstadoSolicitud.RECHAZADA);
                this.saveSolicitud(solicitudO.get());
                res = true;
            }
        }
        return res;
    }

    public boolean deleteSolicitud(int id) {
        boolean res = false;
        Optional<Solicitud> solicitudO = solicitudRepository.findById(id);
        if (solicitudO.isPresent() && solicitudO.get().getEstado().equals(EstadoSolicitud.PENDIENTE)) {
            Evento evento = jwtUtils.userLogin();
            if (evento.getSolicitudes().contains(solicitudO.get())) {
                solicitudRepository.deleteById(id);
                res = true;
            }
        }
        return res;
    }

    public Solicitud getSolicitudById(int id) {
        Optional<Solicitud> solicitudO = solicitudRepository.findById(id);

        if (solicitudO.isPresent()) {
            Object userLogin = jwtUtils.userLogin();
            if (userLogin instanceof Usuario) {
                Usuario usuario = (Usuario) userLogin;
                usuario.getSolicitudes().contains(solicitudO.get());
                return solicitudO.get();
            }
        }

        return null;
    }

    public List<Solicitud> getAllSolicitudes() {
        return solicitudRepository.findAll();
    }

    public Set<Solicitud> getAllSolicitudesByEvento() {
        Evento evento = jwtUtils.userLogin();
        return evento.getSolicitudes();
    }

    public Set<Solicitud> getAllSolicitudesByUsuario() {
        Usuario usuario = jwtUtils.userLogin();
        return usuario.getSolicitudes();
    }
}
