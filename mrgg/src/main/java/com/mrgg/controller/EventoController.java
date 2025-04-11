package com.mrgg.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mrgg.entity.Evento;
import com.mrgg.service.EventoService;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/evento")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @GetMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de eventos obtenida exitosamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<List<Evento>> listarEventos() {
        List<Evento> eventos = eventoService.getAllEventos();

        return ResponseEntity.ok(eventos);
    }

    @DeleteMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Evento eliminado exitosamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<String> eliminarEvento(@PathVariable Integer id) {
        eventoService.deleteEvento(id);
        return ResponseEntity.status(HttpStatus.OK).body("Evento eliminado exitosamente");
    }

}
