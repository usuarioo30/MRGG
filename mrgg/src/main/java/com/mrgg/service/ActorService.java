package com.mrgg.service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.mrgg.entity.Actor;
import com.mrgg.entity.Usuario;
import com.mrgg.repository.ActorRepository;
import com.mrgg.security.JWTUtils;

import jakarta.transaction.Transactional;

@Service
public class ActorService implements UserDetailsService {

    @Autowired
    private ActorRepository actorRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<Actor> findByUsername(String username) {
        return actorRepository.findByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Actor> actorO = this.findByUsername(username);
        if (actorO.isPresent()) {
            Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
            authorities.add(new SimpleGrantedAuthority(actorO.get().getRol().toString()));
            User user = new User(actorO.get().getUsername(), actorO.get().getPassword(), authorities);
            return user;
        } else {
            throw new UsernameNotFoundException("Username no encontrado");
        }
    }

    @Transactional
    public Actor updatePassword(String contrasena) {
        Actor actor = jwtUtils.userLogin();
        if (actor != null) {
            actor.setPassword(passwordEncoder.encode(contrasena));
            return actorRepository.save(actor);
        }
        return null;
    }

    public Optional<Actor> findByClaveSegura(String claveSegura) {
        return actorRepository.findByClaveSegura(claveSegura);
    }

    public Optional<Actor> findByEmail(String email) {
        return actorRepository.findByEmail(email);
    }

    public boolean enviarEmailParaRecuperarContrasena(String email) {
        Optional<Actor> actor = findByEmail(email);
        boolean res = false;

        if (actor.isPresent()) {
            actor.get().setClave_segura(jwtUtils.generarClaveSegura());

            actorRepository.save(actor.get());

            String mensajeHtml = "<!DOCTYPE html>" +
                    "<html lang=\"es\">" +
                    "<head>" +
                    "    <meta charset=\"UTF-8\">" +
                    "    <title>Recuperación de contraseña</title>" +
                    "</head>" +
                    "<body style=\"font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;\">" +
                    "    <div style=\"max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                    +
                    "        <h2 style=\"color: #333;\">Hola,</h2>" +
                    "        <p>Hemos recibido una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el siguiente botón para continuar:</p>"
                    +
                    "        <p style=\"text-align: center; margin: 40px 0;\">" +
                    "            <a href=\"http://localhost:4200/actor/actualizarContrasena/"
                    + actor.get().getClave_segura() + "\" " +
                    "               style=\"display: inline-block; padding: 12px 20px; color: #ffffff; background-color: #28a745; text-decoration: none; border-radius: 5px;\">"
                    +
                    "               Restablecer contraseña" +
                    "            </a>" +
                    "        </p>" +
                    "        <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>" +
                    "        <p style=\"word-break: break-all;\">" +
                    "            <a href=\"http://localhost:4200/actor/actualizarContrasena"
                    + actor.get().getClave_segura() + "\">http://localhost:4200/actor/actualizarContrasena"
                    + actor.get().getClave_segura() + "</a>" +
                    "        </p>" +
                    "        <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>" +
                    "        <p>Gracias,<br>El equipo de MR.GG</p>" +
                    "    </div>" +
                    "</body>" +
                    "</html>";

            this.emailService.enviarCorreo(actor.get().getEmail(), "Recuperación de contraseña", mensajeHtml);

            res = true;
        }

        return res;
    }

    public boolean recuperarContrasena(String claveSegura, String contrasena) {
        Optional<Actor> actor = findByClaveSegura(claveSegura);
        boolean res = false;

        if (actor.isPresent()) {
            actor.get().setPassword(passwordEncoder.encode(contrasena));
            actor.get().setClave_segura(null);

            actorRepository.save(actor.get());

            res = true;
        }

        return res;
    }

}
