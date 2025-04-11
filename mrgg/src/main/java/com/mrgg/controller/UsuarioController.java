package com.mrgg.controller;

import java.net.http.HttpHeaders;
import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mrgg.entity.Usuario;
import com.mrgg.service.UsuarioService;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.getAllUsuarios();

        return ResponseEntity.ok(usuarios);
    }

    @PostMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuario creado exitosamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<String> crearUsuario(@RequestBody Usuario usuario) {
        if (usuarioService.findByUsername(usuario.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El usuario ya existe");
        }

        Usuario u = usuarioService.saveUsuario(usuario);

        if (u != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuario creado exitosamente");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se puede crear el usuario");
        }
    }

    @PutMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario actualziado correctamente"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    public ResponseEntity<String> actualizarUsuario(@RequestBody Usuario usuarioActualizado) {
        Usuario respuesta = usuarioService.updateUsuario(usuarioActualizado);

        if (respuesta != null) {
            return ResponseEntity.status(HttpStatus.OK).body("Usuario actualizado con éxito");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

    @DeleteMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<String> eliminarUsuario() {
        if (usuarioService.deleteUsuario()) {
            return ResponseEntity.status(HttpStatus.OK).body("Usuario eliminado exitosamente");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }
}
