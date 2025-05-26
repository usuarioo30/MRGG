package com.mrgg.service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mrgg.entity.Admin;
import com.mrgg.entity.Roles;
import com.mrgg.entity.Usuario;
import com.mrgg.repository.AdminRepository;
import com.mrgg.security.JWTUtils;

import jakarta.transaction.Transactional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private JWTUtils JWTUtils;

    @Transactional
    public Admin saveAdmin(Admin admin) {
        admin.setRol(Roles.ADMIN);
        admin.setFoto("https://www.gravatar.com/avatar/" + Math.random() * 9000 + "?d=retro&f=y&s=128)");
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setClave_segura(jwtUtils.generarClaveSegura());
        admin.setBaneado(false);

        return adminRepository.save(admin);
    }

    public String generarClaveSegura() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] claveBytes = new byte[24];
        secureRandom.nextBytes(claveBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(claveBytes);
    }

    @Transactional
    public Admin updateAdmin(Admin adminU) {
        Admin admin = JWTUtils.userLogin();
        if (admin != null) {
            admin.setNombre(adminU.getNombre());
            return adminRepository.save(admin);
        }
        return null;
    }

    @Transactional
    public Admin updatePassword(String contrasena) {
        Admin admin = jwtUtils.userLogin();
        if (admin != null) {
            admin.setPassword(passwordEncoder.encode(contrasena));
            return adminRepository.save(admin);
        }
        return null;
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminById(int id) {
        return adminRepository.findById(id);
    }

    public Optional<Admin> findByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    @Transactional
    public boolean deleteAdmin() {
        Admin admin = JWTUtils.userLogin();
        if (admin != null) {
            adminRepository.deleteById(admin.getId());
            return true;
        }
        return false;
    }

    public void adminPorDefecto() {
        if (this.getAllAdmins().size() <= 0) {
            Admin defaultAdmin = new Admin();
            defaultAdmin.setUsername("admin");
            defaultAdmin.setPassword(passwordEncoder.encode("1234"));
            defaultAdmin.setNombre("admin");
            defaultAdmin.setEmail("admin@default.com");
            defaultAdmin.setTelefono("623456789");
            defaultAdmin.setBaneado(false);
            defaultAdmin.setFoto("https://www.gravatar.com/avatar/" + Math.random() * 9000000 + "?d=retro&f=y&s=128)");
            defaultAdmin.setRol(Roles.ADMIN);

            System.out.println("Usuario Admin creado por defecto");
            adminRepository.save(defaultAdmin);
        }
    }

}
