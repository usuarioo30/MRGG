package com.mrgg.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrgg.entity.Admin;
import com.mrgg.entity.Evento;
import com.mrgg.entity.Juego;
import com.mrgg.entity.Roles;
import com.mrgg.entity.TipoCategoria;
import com.mrgg.repository.JuegoRepository;
import com.mrgg.security.JWTUtils;

import jakarta.transaction.Transactional;

@Service
public class JuegoService {

    @Autowired
    private JuegoRepository juegoRepository;

    @Autowired
    private EventoService eventoService;

    @Autowired
    private JWTUtils jwtUtils;

    @Transactional
    public Juego saveJuego(Juego juego) {
        Evento evento = jwtUtils.userLogin();
        Juego juegoSave = juegoRepository.save(juego);

        evento.getJuego();
        eventoService.saveEvento(evento);

        return juegoSave;
    }

    @Transactional
    public Juego updateJuego(int id, Juego juego) {
        Optional<Juego> juegoO = juegoRepository.findById(id);

        if (juegoO.isPresent()) {
            Evento evento = jwtUtils.userLogin();

            if (evento != null && evento.getJuego() != null) {
                Juego juegoExistente = juegoO.get();
                juegoExistente.setNombre(juego.getNombre());
                juegoExistente.setDescripcion(juego.getDescripcion());
                juegoExistente.setCategoria(juego.getCategoria());

                return juegoRepository.save(juegoExistente);
            }
        }

        return null;
    }

    @Transactional
    public boolean deleteJuego(int id) {
        Juego juego = juegoRepository.findById(id).orElse(null);
        if (juego != null) {
            Evento evento = jwtUtils.userLogin();
            if (evento != null && evento.getJuego() != null) {
                juegoRepository.deleteById(id);
                return true;
            }
        }
        return false;
    }

    public Optional<Juego> getJuegoById(int id) {
        return juegoRepository.findById(id);
    }

    public List<Juego> getAllJuegos() {
        return juegoRepository.findAll();
    }

    @Transactional
    public void juegoPorDefecto() {
        if (this.getAllJuegos().size() <= 0) {
            Juego juego1 = new Juego();
            juego1.setNombre("Fc 25");
            juego1.setDescripcion("Descripción del juego 1");
            juego1.setCategoria(TipoCategoria.DEPORTES);

            juegoRepository.save(juego1);

            Juego juego2 = new Juego();
            juego2.setNombre("NBA 2K25");
            juego2.setDescripcion("Descripción del juego 2");
            juego2.setCategoria(TipoCategoria.DEPORTES);

            juegoRepository.save(juego2);

            Juego juego3 = new Juego();
            juego3.setNombre("Madden NFL 25");
            juego3.setDescripcion("Descripción del juego 3");
            juego3.setCategoria(TipoCategoria.DEPORTES);

            juegoRepository.save(juego3);

            System.out.println("Juegos creados por defecto");

        }
    }

}
