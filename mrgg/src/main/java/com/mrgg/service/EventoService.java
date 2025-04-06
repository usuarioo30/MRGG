package com.mrgg.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrgg.entity.Evento;
import com.mrgg.repository.EventoRepository;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    public Evento saveEvento(Evento evento) {
        return eventoRepository.save(evento);
    }

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

    public void deleteEvento(int id) {
        eventoRepository.deleteById(id);
    }

    public Evento getEventoById(int id) {
        return eventoRepository.findById(id).orElse(null);
    }

    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
    }

    public Optional<Evento> getEventosByCategoria(String categoria) {
        return eventoRepository.findByCategoria(categoria);
    }

    // Código sala?

}
