package com.mrgg.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrgg.entity.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
    public Optional<Admin> findByUsername(String username);
}