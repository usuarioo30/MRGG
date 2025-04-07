package com.mrgg.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrgg.entity.Juego;
import com.mrgg.repository.JuegoRepository;

import jakarta.transaction.Transactional;

@Service
public class JuegoService {

    @Autowired
    private JuegoRepository juegoRepository;

    public Juego saveJuego(Juego juego) {
        return juegoRepository.save(juego);
    }

    @Transactional
    public Juego updateJuego(Juego juegoU) {
        Juego juegoExistente = juegoRepository.findById(juegoU.getId()).orElse(null);
        if (juegoExistente == null) {
            return null;
        }

        juegoExistente.setNombre(juegoU.getNombre());
        juegoExistente.setDescripcion(juegoU.getDescripcion());
        juegoExistente.setCategoria(juegoU.getCategoria());

        return juegoRepository.save(juegoU);
    }

    public void deleteJuego(int id) {
        juegoRepository.deleteById(id);
    }

    public Juego getJuegoById(int id) {
        return juegoRepository.findById(id).orElse(null);
    }
}
