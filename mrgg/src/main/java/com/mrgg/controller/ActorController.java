package com.mrgg.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.mrgg.entity.Actor;
import com.mrgg.entity.ActorLogin;
import com.mrgg.entity.Usuario;
import com.mrgg.service.ActorService;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import com.mrgg.security.JWTUtils;

@RestController
public class ActorController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTUtils JWTUtils;

    @Autowired
    private ActorService actorService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody ActorLogin actorLogin) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(actorLogin.getUsername(), actorLogin.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = JWTUtils.generateToken(authentication);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/actorLogueado")
    public ResponseEntity<Actor> login() {
        Actor a = JWTUtils.userLogin();
        if (a == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(a);
    }

    @GetMapping("/actorExiste/{username}")
    public ResponseEntity<Boolean> checkUserExists(@PathVariable String username) {
        boolean exists = actorService.findByUsername(username).isPresent();
        return ResponseEntity.ok(exists);
    }

    @PutMapping("/updateContrasena")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contraseña actualziado correctamente"),
            @ApiResponse(responseCode = "404", description = "Contraseña no encontrada"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    public ResponseEntity<Void> actualizarContrasena(@RequestBody String contrasena) {
        Actor respuesta = actorService.updatePassword(contrasena);

        if (respuesta != null) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/actor/enviarEmailParaRecuperarContrasena")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contraseña actualziado correctamente"),
            @ApiResponse(responseCode = "404", description = "Contraseña no encontrada"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    public ResponseEntity<Void> enviarEmailParaRecuperarContrasena(@RequestBody String email) {
        boolean respuesta = actorService.enviarEmailParaRecuperarContrasena(email);

        if (respuesta == true) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/actor/recuperarContrasena/{claveSegura}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contraseña actualziado correctamente"),
            @ApiResponse(responseCode = "404", description = "Contraseña no encontrada"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    public ResponseEntity<Void> recuperarContrasena(@RequestBody String contrasena, @PathVariable String claveSegura) {
        boolean respuesta = actorService.recuperarContrasena(claveSegura, contrasena);

        if (respuesta == true) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
