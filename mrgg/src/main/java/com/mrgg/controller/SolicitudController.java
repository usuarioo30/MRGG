package com.mrgg.controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mrgg.entity.Solicitud;
import com.mrgg.service.SolicitudService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;


@RestController
@RequestMapping("/solicitud")
public class SolicitudController {
    @Autowired
    private SolicitudService solicitudService;

    @GetMapping("/delEvento/{id}")
    @Operation(summary = "Obtener todas las solicitudes de evento")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de solicitudes de usuario obtenida exitosamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<Set<Solicitud>> getAllSolicitudesByUsuarioRecibe(@PathVariable int id) {
        Set<Solicitud> listSolicitud = solicitudService.getAllSolicitudesByEvento(id);
        return ResponseEntity.ok(listSolicitud);
    }

    @GetMapping("/misSolicitudes")
    @Operation(summary = "Obtener todas las solicitudes creadas por el usuario logueado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Solicitudes obtenidas correctamente"),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado")
    })
    public ResponseEntity<Set<Solicitud>> getSolicitudesCreadasPorUsuario() {
        Set<Solicitud> solicitudes = solicitudService.getAllSolicitudesByUsuario();
        return ResponseEntity.ok(solicitudes);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar una solicitud por ID filtrado por emisor y receptor propietario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Solicitud encontrada"),
            @ApiResponse(responseCode = "404", description = "Solicitud no encontrada, o emisor/receptor no logueado")
    })
    public ResponseEntity<Solicitud> findOneSolicitud(@PathVariable int id) {
        Solicitud solicitud = solicitudService.getSolicitudById(id);
        if (solicitud == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            return ResponseEntity.ok(solicitud);
        }
    }

    @GetMapping("/accept/{id}")
    @Operation(summary = "Aceptar una solicitud por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "202", description = "Solicitud aceptada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Error al aceptar la solicitud"),
            @ApiResponse(responseCode = "403", description = "No tiene permiso para aceptar esta solicitud")
    })
    public ResponseEntity<Void> acceptSolicitud(@PathVariable int id) {
        Boolean verEstado = solicitudService.acceptSolicitud(id);
        if (!verEstado) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .build();
        } else {
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        }
    }

    @GetMapping("/refuse/{id}")
    @Operation(summary = "Rechazar una solicitud por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "202", description = "Solicitud rechazada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Error al rechazar la solicitud"),
            @ApiResponse(responseCode = "403", description = "Permiso denegado, no es el propietario del evento")
    })
    public ResponseEntity<Void> refuseSolicitud(@PathVariable int id) {
        Boolean verEstado = solicitudService.refuseSolicitud(id);
        if (verEstado == false) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .build();
        } else {
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        }
    }

    @GetMapping("create/{idEvento}")
    @Operation(summary = "Crear una nueva solicitud para un evento")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "202", description = "Solicitud creada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Error al crear la solicitud")
    })
    public ResponseEntity<Void> save(@PathVariable int idEvento) {
        Boolean solicitudSave = solicitudService.createSolicitud(idEvento);
        if (solicitudSave == false) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } else {
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una solicitud por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "202", description = "Solicitud eliminada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Error al borrar la solicitud")
    })
    public ResponseEntity<Void> delete(@PathVariable int id) {
        Boolean verEstadoBorrado = solicitudService.deleteSolicitud(id);
        if (verEstadoBorrado == false) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } else {
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        }
    }

    @GetMapping("/usuarioTieneSolicitudEvento/{id}")
    public Boolean isEventoTieneSoliciutdByUser(@PathVariable int id) {
        System.out.println("hol " + id);
        return solicitudService.isEventoTieneSoliciutdByUser(id);
    }

}
