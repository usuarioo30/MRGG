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
    private JWTUtils jwtUtils;

    @Transactional
    public Solicitud saveSolicitud(Solicitud solicitud) {
        return solicitudRepository.save(solicitud);
    }

    public Solicitud createSolicitud(int idUsuario) {
        Solicitud res;
        Optional<Usuario> usuarioO = usuarioService.getUsuarioById(idUsuario);
        if (usuarioO.isEmpty()) {
            res = new Solicitud();
            res.setEstado(EstadoSolicitud.PENDIENTE);
            Usuario usuarioSolicitante = jwtUtils.userLogin();

            solicitudRepository.save(res);
            usuarioSolicitante.getSolicitudes().add(res);
            usuarioService.saveUsuario(usuarioSolicitante);

            Usuario usuarioRecibe = usuarioO.get();
            usuarioRecibe.getSolicitudes().add(res);
            usuarioService.saveUsuario(usuarioRecibe);
        } else {
            res = null;
        }

        return res;
    }

    public boolean acceptSolicitud(int id) {
        boolean res = false;
        Optional<Solicitud> solicitudO = solicitudRepository.findById(id);
        if (solicitudO.isPresent()) {
            Usuario usuario = jwtUtils.userLogin();
            if (usuario.getSolicitudes().contains(solicitudO.get())) {
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
            Usuario usuario = jwtUtils.userLogin();
            if (usuario.getSolicitudes().contains(solicitudO.get())) {
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
            Usuario usuario = jwtUtils.userLogin();
            if (usuario.getSolicitudes().contains(solicitudO.get())) {
                usuario.getSolicitudes().remove(solicitudO.get());
                usuarioService.saveUsuario(usuario);

                for (Usuario usuarioRecibe : usuarioService.getAllUsuarios()) {
                    if (usuarioRecibe.getSolicitudes().contains(solicitudO.get())) {
                        usuarioRecibe.getSolicitudes().remove(solicitudO.get());
                        usuarioService.saveUsuario(usuarioRecibe);
                    }
                }

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

    public Set<Solicitud> getAllSolicitudesByUsuarioSolicitante() {
        Usuario usuario = jwtUtils.userLogin();
        return usuario.getSolicitudes();
    }

    public Set<Solicitud> getAllSolicitudesByUsuarioRecibe() {
        Usuario usuario = jwtUtils.userLogin();
        return usuario.getSolicitudes();
    }
}
