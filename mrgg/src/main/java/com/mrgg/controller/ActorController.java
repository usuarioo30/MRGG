package com.mrgg.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.mrgg.entity.ActorLogin;
import com.mrgg.entity.Admin;
import com.mrgg.repository.AdminRepository;

@RestController
public class ActorController {

    @Autowired
    private AdminRepository adminRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody ActorLogin actorLogin) {
        // Buscamos al admin por su nombre de usuario
        Optional<Admin> adminOptional = adminRepository.findByUsername(actorLogin.getUsername());

        // Si el admin existe y las credenciales coinciden
        if (adminOptional.isPresent()) {
            Admin admin = adminOptional.get(); // Extraemos el admin del Optional

            // Verificamos si la contraseña coincide (sin cifrado)
            if (actorLogin.getPassword().equals(admin.getPassword())) {
                // Token simulado (puedes cambiar esto más tarde por un JWT)
                String token = "simulated-jwt-token";

                Map<String, String> response = new HashMap<>();
                response.put("token", token);

                return ResponseEntity.ok(response); // Devuelve el token en la respuesta
            }
        }

        // Si no existe el admin o las credenciales no coinciden
        Map<String, String> response = new HashMap<>();
        response.put("error", "Invalid credentials");

        return ResponseEntity.status(401).body(response); // 401 Unauthorized
    }
}
