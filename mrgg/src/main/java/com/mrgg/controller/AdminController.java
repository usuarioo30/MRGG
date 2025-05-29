package com.mrgg.controller;

import java.util.List;

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

import com.mrgg.entity.Admin;
import com.mrgg.entity.Usuario;
import com.mrgg.service.AdminService;

import io.swagger.v3.oas.annotations.responses.ApiResponses;
import okhttp3.Response;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de administradores obtenida exitosamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<List<Admin>> listarAdmins() {
        List<Admin> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    @PutMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Administrador actualizado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Administrador no encontrado"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida") })
    public void actualizarAdmin(@RequestBody Admin adminActualizado) {

        Admin respuesta = adminService.updateAdmin(adminActualizado);
        if (respuesta != null) {
            ResponseEntity.status(HttpStatus.OK).build();
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/updateContrasena")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contraseña actualziado correctamente"),
            @ApiResponse(responseCode = "404", description = "Contraseña no encontrada"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    public ResponseEntity<Void> actualizarContrasena(@RequestBody String contrasena) {
        Admin respuesta = adminService.updatePassword(contrasena);

        if (respuesta != null) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuario creado exitosamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<Void> crearUsuario(@RequestBody Admin admin) {
        if (adminService.findByUsername(admin.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Admin a = adminService.saveAdmin(admin);

        if (a != null) {
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping
    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Administrador eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Administrador no encontrado") })
    public void eliminarAdmin() {
        if (adminService.deleteAdmin()) {
            ResponseEntity.status(HttpStatus.OK).body("Administrador eliminado exitosamente");
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Administrador no encontrado");
        }
    }

}
