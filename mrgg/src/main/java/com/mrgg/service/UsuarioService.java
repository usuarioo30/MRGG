package com.mrgg.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mrgg.entity.Roles;
import com.mrgg.entity.Usuario;
import com.mrgg.repository.UsuarioRepository;
import com.mrgg.security.JWTUtils;

import jakarta.transaction.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Usuario saveUsuario(Usuario usuario) {
        usuario.setRol(Roles.USER);
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setFoto("https://www.gravatar.com/avatar/" + Math.random() * 9000 + "?d=retro&f=y&s=128)");
        usuario.setBaneado(true);
        usuario.setClave_segura(jwtUtils.generarClaveSegura());

        Usuario usuarioU = usuarioRepository.save(usuario);

        String mensajeHtml = "<!DOCTYPE html>" +
                "<html lang=\"es\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <title>Verificación de correo electrónico</title>" +
                "</head>" +
                "<body style=\"font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;\">" +
                "    <div style=\"max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                +
                "        <h2 style=\"color: #333;\">Hola,</h2>" +
                "        <p>Gracias por registrarte. Para completar tu registro, por favor verifica tu dirección de correo electrónico haciendo clic en el siguiente botón:</p>"
                +
                "        <p style=\"text-align: center; margin: 40px 0;\">" +
                "            <a href=\"https://mrgg-ten.vercel.app/usuario/verificarUsuario/" + usuario.getClave_segura()
                + "\" " +
                "               style=\"display: inline-block; padding: 12px 20px; color: #ffffff; background-color: #007BFF; text-decoration: none; border-radius: 5px;\">"
                +
                "               Verificar correo" +
                "            </a>" +
                "        </p>" +
                "        <p>Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:</p>" +
                "        <p style=\"word-break: break-all;\">" +
                "            <a href=\"https://mrgg-ten.vercel.app/usuario/verificarUsuario/" + usuario.getClave_segura()
                + "\">https://mrgg-ten.vercel.app/usuario/verificarUsuario/" + usuario.getClave_segura() + "</a>" +
                "        </p>" +
                "        <p>Gracias,<br>El equipo de MR.GG</p>" +
                "    </div>" +
                "</body>" +
                "</html>";

        this.emailService.enviarCorreo(usuario.getEmail(), "Verificación de correo", mensajeHtml);

        return usuarioU;
    }

    @Transactional
    public Usuario saveUsuarioGeneral(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario updateUsuario(Usuario usuarioU) {
        Usuario usuario = jwtUtils.userLogin();
        if (usuario != null) {
            usuario.setNombre(usuarioU.getNombre());
            return usuarioRepository.save(usuario);
        }

        return null;
    }

    @Transactional
    public Usuario updatePassword(String contrasena) {
        Usuario usuario = jwtUtils.userLogin();
        if (usuario != null) {
            usuario.setPassword(passwordEncoder.encode(contrasena));
            return usuarioRepository.save(usuario);
        }
        return null;
    }

    @Transactional
    public boolean deleteUsuario() {
        Usuario usuario = jwtUtils.userLogin();

        if (usuario != null) {
            usuarioRepository.deleteById(usuario.getId());
            return true;
        }

        return false;
    }

    @Transactional
    public Usuario cambiarEstadoBaneo(int id, boolean nuevoEstado) {
        Optional<Usuario> usuarioO = usuarioRepository.findById(id);
        if (usuarioO.isPresent()) {
            Usuario usuario = usuarioO.get();
            usuario.setBaneado(nuevoEstado);
            return usuarioRepository.save(usuario);
        } else {
            throw new RuntimeException("Usuario no encontrado");
        }
    }

    public Optional<Usuario> getUsuarioById(int id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public Optional<Usuario> getUsuarioByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public Optional<Usuario> findUserBySolicitud(int id) {
        return usuarioRepository.findUserBySolicitud(id);
    }

    public Optional<Usuario> findUserByMensaje(int id) {
        return usuarioRepository.findUserByMensaje(id);
    }

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> findByClaveSegura(String claveSegura) {
        return usuarioRepository.findByClaveSegura(claveSegura);
    }

    public boolean activarUsuario(String claveSegura) {
        Optional<Usuario> usuario = findByClaveSegura(claveSegura);
        boolean res = false;

        if (usuario.isPresent()) {
            usuario.get().setBaneado(false);
            usuario.get().setClave_segura(null);

            usuarioRepository.save(usuario.get());

            res = true;
        }

        return res;
    }
}
