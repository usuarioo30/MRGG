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

    /**
     * Esta función lo que hce es mandar un mensaje tanto de administrador a usuario
     * como de usuario a administrador, de manera que si el rol del actor es usuario
     * ignora e parámetro de username, ya que el usuario envía un mensaje a todos
     * los administrdores, y en cambio el administrador deberá de poner un username
     * para saber a quien va el mensaje
     * 
     * @param mensaje
     * @param username
     * @return
     */
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

    @Transactional
    public boolean eliminarMensaje(int mensajeId) {
        Actor actor = jwtUtils.userLogin();

        if (actor == null) {
            return false;
        }

        Optional<Mensaje> mensajeOpt = mensajeRepository.findById(mensajeId);

        if (mensajeOpt.isEmpty()) {
            return false;
        }

        Mensaje mensaje = mensajeOpt.get();

        if (actor.getRol() == Roles.ADMIN) {
            mensajeRepository.delete(mensaje);
            return true;

        } else if (actor.getRol() == Roles.USER) {
            Usuario usuario = (Usuario) actor;
            if (usuario.getMensajes().contains(mensaje)) {
                usuario.getMensajes().remove(mensaje);
                usuarioService.saveUsuarioGeneral(usuario);
                mensajeRepository.delete(mensaje);
                return true;
            }
        }

        return false;
    }

    /**
     * Recupera un mensaje por su ID y registra al usuario o administrador que lo ha
     * leído.
     *
     * @param id el identificador del mensaje a obtener.
     * @return el objeto {@link Mensaje} si el usuario tiene acceso al mensaje, o
     *         null en caso contrario.
     *
     *         Este método realiza lo siguiente:
     *         - Busca el mensaje por ID en la base de datos.
     *         - Obtiene el usuario autenticado mediante JWT.
     *         - Si el usuario es administrador, siempre puede ver el mensaje y se
     *         registra su lectura.
     *         - Si el usuario es de rol USER, solo puede acceder a los mensajes que
     *         le pertenecen.
     *         En tal caso, si no ha leído el mensaje previamente, se registra su
     *         lectura.
     *         - En ambos casos, si el usuario aún no estaba registrado en la lista
     *         de lectores,
     *         se le añade y se guarda el mensaje actualizado.
     *         - Si el usuario no tiene permiso para ver el mensaje, se devuelve
     *         null.
     */
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

    /**
     * Marca un mensaje como leído por el usuario actualmente autenticado.
     *
     * @param mensajeId el identificador del mensaje que se desea marcar como leído.
     * @return el objeto {@link Mensaje} actualizado con el usuario añadido a la
     *         lista de lectores,
     *         o null si el mensaje no existe.
     *
     *         Este método realiza lo siguiente:
     *         - Recupera el mensaje por su ID desde la base de datos.
     *         - Obtiene el usuario autenticado mediante JWT.
     *         - Verifica si el usuario ya ha leído el mensaje.
     *         - Si no lo ha hecho, lo añade a la lista de usuarios que han leído el
     *         mensaje.
     *         - Guarda el mensaje actualizado en la base de datos.
     *
     *         La operación está marcada como @Transactional para asegurar la
     *         persistencia de los cambios.
     */
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
