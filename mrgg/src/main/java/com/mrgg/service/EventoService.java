package com.mrgg.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrgg.entity.Evento;
import com.mrgg.entity.Usuario;
import com.mrgg.repository.EventoRepository;
import com.mrgg.security.JWTUtils;

import jakarta.transaction.Transactional;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Transactional
    public Evento updateEvento(Evento eventoU) {
        Evento eventoExistente = eventoRepository.findById(eventoU.getId()).orElse(null);
        if (eventoExistente == null) {
            return null;
        }

        eventoExistente.setCodigo_sala(eventoU.getCodigo_sala());
        eventoExistente.setNum_usuario(eventoU.getNum_usuario());
        eventoExistente.setEstado(eventoU.getEstado());
        eventoExistente.setFecha_inicio(eventoU.getFecha_inicio());
        eventoExistente.setComentario(eventoU.getComentario());

        return eventoRepository.save(eventoU);
    }

    @Transactional
    public boolean deleteEvento(Integer id) {
        Usuario usuario = jwtUtils.userLogin();
        Optional<Evento> evento = eventoRepository.findById(id);

        if (evento.isPresent()) {
            if (usuario.getEventos().contains(evento.get())) {
                eventoRepository.deleteById(id);
                return true;
            }
        }
        return false;
    }

    public Evento getEventoById(int id) {
        return eventoRepository.findById(id).orElse(null);
    }

    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
    }

}
