package com.mrgg.controller;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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

import com.mrgg.entity.Evento;
import com.mrgg.service.EventoService;

import io.swagger.v3.oas.annotations.Operation;
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

    @GetMapping("/deUsuario")
    @Operation(summary = "Obtener todos eventos de usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de tareas de reparaciones de cliente obtenida exitosamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor") })
    public ResponseEntity<Set<Evento>> listarEventosDeUsuario() {
        Set<Evento> listSolicitud = eventoService.getAllEventosByUsuario();
        return ResponseEntity.ok(listSolicitud);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar un evento por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Producto encontrado"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    public ResponseEntity<Evento> findOneEvento(@PathVariable int id) {
        Optional<Evento> producto = eventoService.getEventoById(id);
        if (producto.isPresent()) {
            return ResponseEntity.ok(producto.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/porJuego/{id}")
    @Operation(summary = "Obtener todos los eventos de un juego específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de eventos obtenida exitosamente"),
            @ApiResponse(responseCode = "404", description = "Juego no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<List<Evento>> getEventosByJuego(@PathVariable Integer id) {
        List<Evento> eventos = eventoService.getEventosByJuegoId(id);
        if (eventos != null && !eventos.isEmpty()) {
            return ResponseEntity.ok(eventos);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/cantidad/{juegoId}")
    public ResponseEntity<Integer> obtenerCantidadEventosPorJuego(@PathVariable Long juegoId) {
        int cantidad = eventoService.obtenerCantidadEventosPorJuego(juegoId);
        return ResponseEntity.ok(cantidad);
    }

    @GetMapping("/usuario/{id}")
    @Operation(summary = "Obtener el usuario propietario de un evento por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
            @ApiResponse(responseCode = "404", description = "Evento no encontrado")
    })
    public ResponseEntity<String> getUsuarioByEventoId(@PathVariable int id) {
        Optional<Evento> evento = eventoService.getEventoById(id);
        if (evento.isPresent()) {
            return ResponseEntity.ok(evento.get().getUsuario().getUsername());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Evento no encontrado");
        }
    }

    @PostMapping("/crear/{juegoId}")
    @Operation(summary = "Crear un nuevo evento asociado a un juego específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Evento creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida o juego no encontrado")
    })
    public ResponseEntity<Void> guardarEventoPorJuego(@PathVariable Integer juegoId, @RequestBody Evento evento) {
        Evento e = eventoService.saveEventoPorJuego(evento, juegoId);
        if (e != null) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un evento existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Evento actualizado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Evento no encontrado"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida, e\"Evento no encontrado o no es propietario el usuario logueado")
    })
    public ResponseEntity<Void> actualizarEvento(@PathVariable int id, @RequestBody Evento eventoActualizado) {
        Evento response = eventoService.updateEvento(id, eventoActualizado);
        if (response != null) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un evento por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Evento eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Evento no encontrado o no es propietario el usuario logueado")
    })
    public ResponseEntity<Void> eliminarEvento(@PathVariable int id) {
        if (eventoService.deleteEvento(id)) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .build();
        }
    }

}
