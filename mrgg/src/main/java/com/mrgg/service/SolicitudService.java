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
    private UsuarioService usuarioService;

    @Autowired
    private EventoService eventoService;

    @Autowired
    private JWTUtils jwtUtils;

    @Transactional
    public Solicitud saveSolicitud(Solicitud solicitud) {
        return solicitudRepository.save(solicitud);
    }

    public boolean createSolicitud(int idEvento) {
        boolean res = false;
        Optional<Evento> eventoO = eventoService.getEventoById(idEvento);
        if (!eventoO.isEmpty()) {
            Solicitud s = new Solicitud();
            s.setEstado(EstadoSolicitud.PENDIENTE);
            solicitudRepository.save(s);

            Usuario usuarioSolicitante = jwtUtils.userLogin();
            usuarioSolicitante.getSolicitudes().add(s);
            usuarioService.saveUsuarioGeneral(usuarioSolicitante);

            Evento evento = eventoO.get();
            evento.getSolicitudes().add(s);
            eventoService.saveEventoBySolicitud(evento);
            res = true;
        }

        return res;
    }

    public boolean acceptSolicitud(int id) {
        boolean res = false;
        Optional<Solicitud> solicitudO = solicitudRepository.findById(id);

        if (solicitudO.isPresent()) {
            Solicitud solicitud = solicitudO.get();

            Evento evento = eventoService.findBySolicitudId(solicitud.getId());

            if (evento != null) {
                Usuario usuario = jwtUtils.userLogin();

                if (evento.getUsuario().equals(usuario)) {
                    solicitud.setEstado(EstadoSolicitud.ACEPTADA);
                    solicitudRepository.save(solicitud);
                    res = true;
                } else {
                    res = false;
                }
            }
        }
        return res;
    }

    public boolean refuseSolicitud(int id) {
        boolean res = false;
        Optional<Solicitud> solicitudO = solicitudRepository.findById(id);

        if (solicitudO.isPresent()) {
            Solicitud solicitud = solicitudO.get();

            Evento evento = eventoService.findBySolicitudId(solicitud.getId());

            if (evento != null) {
                Usuario usuario = jwtUtils.userLogin();

                if (evento.getUsuario().equals(usuario)) {
                    solicitud.setEstado(EstadoSolicitud.RECHAZADA);
                    solicitudRepository.save(solicitud);
                    res = true;
                } else {
                    res = false;
                }
            }
        }
        return res;
    }

    @Transactional
    public boolean deleteSolicitud(int id) {
        Optional<Solicitud> solicitudO = solicitudRepository.findById(id);
        if (solicitudO.isEmpty()) {
            return false;
        }

        Solicitud solicitud = solicitudO.get();

        Usuario usuarioLogueado = jwtUtils.userLogin();

        if (!usuarioLogueado.getSolicitudes().contains(solicitud)) {
            return false;
        }

        usuarioLogueado.getSolicitudes().remove(solicitud);
        usuarioService.saveUsuarioGeneral(usuarioLogueado);

        Evento evento = eventoService.findBySolicitudId(solicitud.getId());
        if (evento != null) {
            evento.getSolicitudes().remove(solicitud);
            eventoService.saveEventoBySolicitud(evento);
        }

        solicitudRepository.deleteById(id);
        return true;
    }

    public boolean isEventoTieneSoliciutdByUser(int id) {
        Optional<Evento> eventoO = eventoService.getEventoById(id);
        boolean res = false;

        if (eventoO.isPresent()) {
            eventoO.get().getSolicitudes();
            Usuario usuario = jwtUtils.userLogin();
            usuario.getSolicitudes().retainAll(eventoO.get().getSolicitudes());

            if (usuario.getSolicitudes().size() != 0) {
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

    public Set<Solicitud> getAllSolicitudesByEvento(int id) {
        Set<Solicitud> res = null;
        Optional<Evento> eventoO = eventoService.getEventoById(id);
        if (!eventoO.isEmpty()) {
            res = eventoO.get().getSolicitudes();
        }
        return res;
    }

    public Set<Solicitud> getAllSolicitudesByUsuario() {
        Usuario usuario = jwtUtils.userLogin();
        return usuario.getSolicitudes();
    }

}
