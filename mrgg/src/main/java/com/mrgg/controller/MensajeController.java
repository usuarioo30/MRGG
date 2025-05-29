package com.mrgg.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mrgg.entity.Mensaje;
import com.mrgg.service.MensajeService;

@RestController
@RequestMapping("/mensaje")
public class MensajeController {

    @Autowired
    private MensajeService mensajeService;

    @PostMapping("/enviar/{username}")
    public ResponseEntity<Void> mandarMensaje(@RequestBody Mensaje mensaje, @PathVariable String username) {
        Boolean mandarMensaje = mensajeService.mandarMensaje(mensaje, username);
        if (!mandarMensaje) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .build();
        } else {
            return ResponseEntity.status(HttpStatus.CREATED).build();
        }
    }

    @PostMapping("/enviar")
    public ResponseEntity<Void> mandarMensajeUsuario(@RequestBody Mensaje mensaje) {
        Boolean mandarMensaje = mensajeService.mandarMensaje(mensaje, null);
        if (!mandarMensaje) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .build();
        } else {
            return ResponseEntity.status(HttpStatus.CREATED).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mensaje> getMensaje(@PathVariable int id) {
        Mensaje mensaje = mensajeService.getMensaje(id);
        if (mensaje != null) {
            return ResponseEntity.ok(mensaje);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/usuario")
    public ResponseEntity<List<Mensaje>> getMensajesUsuario() {
        List<Mensaje> mensajes = mensajeService.getMensajesUsuario();
        return ResponseEntity.ok(mensajes);
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Mensaje>> getMensajesAdmin() {
        List<Mensaje> mensajes = mensajeService.getMensajesAdmin();
        return ResponseEntity.ok(mensajes);
    }

    @PutMapping("/{id}/leido")
    public ResponseEntity<Mensaje> marcarMensajeComoLeido(@PathVariable int id) {
        Mensaje m = mensajeService.marcarComoLeido(id);
        if (m != null) {
            return ResponseEntity.ok(m);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMensaje(@PathVariable int id) {
        boolean eliminado = mensajeService.eliminarMensaje(id);
        if (eliminado) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

}
