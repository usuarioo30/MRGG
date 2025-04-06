package com.mrgg.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrgg.entity.Admin;
import com.mrgg.repository.AdminRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public void adminPorDefecto() {
        if (this.getAllAdmins().size() <= 0) {
            Admin defaultAdmin = new Admin();
            defaultAdmin.setUsername("admin");
            // defaultAdmin.setPassword(passwordEncoder.encode("1234"));
            defaultAdmin.setNombre("admin");
            defaultAdmin.setCorreo_electronico("admin@default.com");
            defaultAdmin.setTelefono("623456789");
            defaultAdmin.setBaneado(false);
            defaultAdmin.setFoto("http://default.png");

            System.out.println("Usuario Admin creado por defecto");
            adminRepository.save(defaultAdmin);
        }
    }
}
