package com.mrgg.service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.mrgg.entity.Actor;
import com.mrgg.entity.Admin;
import com.mrgg.entity.Mensaje;
import com.mrgg.entity.Roles;
import com.mrgg.entity.Usuario;
import com.mrgg.repository.MensajeRepository;
import com.mrgg.security.JWTUtils;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MensajeService {
    @Autowired
    private MensajeRepository mensajeRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JWTUtils jwtUtils;

    @Transactional
    public boolean mandarMensaje(Mensaje mensaje, String username) {
        Actor actor = jwtUtils.userLogin();
        boolean res = false;

        if (actor != null) {
            mensaje.setFechaEnvio(new Date(System.currentTimeMillis()));

            if (actor.getRol() == Roles.ADMIN) {
                mensaje.setEsAdmin(true);

                Optional<Usuario> usuarioO = usuarioService.findByUsername(username);

                if (usuarioO.isPresent()) {
                    Mensaje m = mensajeRepository.save(mensaje);

                    usuarioO.get().getMensajes().add(m);

                    usuarioService.saveUsuarioGeneral(usuarioO.get());

                    res = true;
                }
            } else if (actor.getRol() == Roles.USER) {
                mensaje.setEsAdmin(false);

                Mensaje m = mensajeRepository.save(mensaje);

                Usuario usuarioU = (Usuario) actor;

                usuarioU.getMensajes().add(m);

                usuarioService.saveUsuarioGeneral(usuarioU);

                res = true;
            }
        }

        return res;
    }

    public Mensaje getMensaje(int id) {
        Mensaje m = mensajeRepository.findById(id).orElse(null);

        if (m != null) {
            Actor actor = jwtUtils.userLogin();

            if (actor != null) {
                if (m.getUsuarioQueLee() == null) {
                    m.setUsuarioQueLee(new ArrayList<>());
                }

                String username = actor.getUsername();

                if (actor.getRol() == Roles.ADMIN) {
                    if (!m.getUsuarioQueLee().contains(username)) {
                        m.getUsuarioQueLee().add(username);
                        mensajeRepository.save(m);
                    }

                } else if (actor.getRol() == Roles.USER) {
                    Usuario usuarioU = (Usuario) actor;

                    if (usuarioU.getMensajes().contains(m)) {
                        if (!m.getUsuarioQueLee().contains(username)) {
                            m.getUsuarioQueLee().add(username);
                            mensajeRepository.save(m);
                        }
                    } else {
                        m = null;
                    }
                }
            }
        }

        return m;
    }

    public List<Mensaje> getMensajesUsuario() {
        Usuario usuario = jwtUtils.userLogin();

        List<Mensaje> res = new ArrayList<Mensaje>();

        if (usuario != null) {
            res = usuario.getMensajes();
        }

        return res;
    }

    public List<Mensaje> getMensajesAdmin() {
        Admin admin = jwtUtils.userLogin();

        List<Mensaje> res = new ArrayList<Mensaje>();

        if (admin != null) {
            res = mensajeRepository.findAll();
        }

        return res;
    }

    @Transactional
    public Mensaje marcarComoLeido(int mensajeId) {
        Mensaje mensaje = mensajeRepository.findById(mensajeId).orElse(null);
        Actor actor = jwtUtils.userLogin();

        if (mensaje != null && actor != null) {
            if (mensaje.getUsuarioQueLee() == null) {
                mensaje.setUsuarioQueLee(new ArrayList<>());
            }
            String username = actor.getUsername();
            if (!mensaje.getUsuarioQueLee().contains(username)) {
                mensaje.getUsuarioQueLee().add(username);
                mensajeRepository.save(mensaje);
            }
        }
        return mensaje;
    }

}
