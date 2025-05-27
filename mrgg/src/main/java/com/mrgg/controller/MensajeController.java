package com.mrgg.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
    public boolean mandarMensaje(@RequestBody Mensaje mensaje, @PathVariable String username) {
        return mensajeService.mandarMensaje(mensaje, username);
    }

    @GetMapping("/{id}")
    public Mensaje getMensaje(@PathVariable int id) {
        return mensajeService.getMensaje(id);
    }

    @GetMapping("/usuario")
    public List<Mensaje> getMensajesUsuario() {
        return mensajeService.getMensajesUsuario();
    }

    @GetMapping("/admin")
    public List<Mensaje> getMensajesAdmin() {
        return mensajeService.getMensajesAdmin();
    }

}
