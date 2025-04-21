package com.mrgg.controller;

import java.util.List;
import java.util.Optional;

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

import com.mrgg.entity.Juego;
import com.mrgg.service.JuegoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/juego")
public class JuegoController {

    @Autowired
    private JuegoService juegoService;

    @GetMapping
    @Operation(summary = "Obtener todos los juegos")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de juegos obtenida exitosamente"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<List<Juego>> getAllProductos() {
        List<Juego> productos = juegoService.getAllJuegos();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar un juego por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Juego encontrado"),
        @ApiResponse(responseCode = "404", description = "Juego no encontrado")
    })
    public ResponseEntity<Juego> findOneJuego(@PathVariable int id) {
        Optional<Juego> juego = juegoService.getJuegoById(id);
        if (juego.isPresent()) {
            return ResponseEntity.ok(juego.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping
    @Operation(summary = "Guardar un nuevo producto")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Producto creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    public ResponseEntity<String> saveJuego(@RequestBody Juego juego) {
        Juego j = juegoService.saveJuego(juego);
        if (j != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Juego creado exitosamente");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se pudo crear el juego");
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un juego existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Producto actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida, e\"Producto no encontrado o no es propietario el usuario loguead")
    })
    public ResponseEntity<String> updateJuego(@PathVariable int id, @RequestBody Juego updatedJuego) {
        Juego response = juegoService.updateJuego(id, updatedJuego);
        if (response != null) {
            return ResponseEntity.status(HttpStatus.OK).body("Juego actualizado exitosamente");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Juego no encontrado");
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un juego por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Juego eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Juego no encontrado o no es propietario el usuario logueado")
    })
    public ResponseEntity<String> deleteProducto(@PathVariable int id) {
        if (juegoService.deleteJuego(id)) {
            return ResponseEntity.status(HttpStatus.OK).body("Juego eliminado exitosamente");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Juego no encontrado o no es propietario el usuario logueado");
        }
    }
}
