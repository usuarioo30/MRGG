package com.mrgg.controller;

import java.io.IOException;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mrgg.entity.Juego;
import com.mrgg.entity.TipoCategoria;
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

    @GetMapping("/categoria")
    @Operation(summary = "Obtener juegos por categoría")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de juegos de la categoría obtenida exitosamente"),
            @ApiResponse(responseCode = "400", description = "Categoría no válida o solicitud incorrecta"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<List<Juego>> getAllJuegosByCategoria(@RequestParam TipoCategoria categoria) {
        // Llamamos al servicio que obtiene los juegos por categoría
        List<Juego> juegos = juegoService.getAllJuegosByCategoria(categoria);
        if (juegos.isEmpty()) {
            // return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(juegos);
    }

    @PostMapping
    @Operation(summary = "Guardar un nuevo juego")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Juego creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    public ResponseEntity<Void> saveJuego(@RequestBody Juego juego) throws IOException {
        Juego j = juegoService.saveJuego(juego);
        if (j != null) {
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un juego existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Juego actualizado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Juego no encontrado"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida, e\"Juego no encontrado o no es propietario el usuario loguead")
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
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
