package com.mrgg.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mrgg.service.EmailService;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/enviar")
    public String enviar() {
        emailService.enviarCorreo("lora99w@gmail.com", "Hola",
                "Este es un correo enviado desde Spring Boot con Gmail.");
        return "Correo enviado";
    }
}
