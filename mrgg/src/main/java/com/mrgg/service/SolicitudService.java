package com.mrgg.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrgg.entity.EstadoSolicitud;
import com.mrgg.entity.Solicitud;
import com.mrgg.repository.SolicitudRepository;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;

    public Solicitud saveSolicitud(Solicitud solicitud) {
        return solicitudRepository.save(solicitud);
    }

    public boolean acceptSolicitud(int id) {
        boolean res = false;
        Optional<Solicitud> solicitudO = solicitudRepository.findById(id);
        if (solicitudO.isPresent()) {
            solicitudO.get().setEstado(EstadoSolicitud.ACEPTADA);
            this.saveSolicitud(solicitudO.get());
            res = true;
        }
        return res;
    }

    public boolean refuseSolicitud(int id) {
        boolean res = false;
        Optional<Solicitud> solicitudO = solicitudRepository.findById(id);
        if (solicitudO.isPresent()) {
            solicitudO.get().setEstado(EstadoSolicitud.RECHAZADA);
            this.saveSolicitud(solicitudO.get());
            res = true;
        }
        return res;
    }

    public boolean deleteSolicitud(int id) {
        boolean res = false;
        Optional<Solicitud> solicitudO = solicitudRepository.findById(id);
        if (solicitudO.isPresent()) {
            solicitudO.get().setEstado(EstadoSolicitud.PENDIENTE);
            this.saveSolicitud(solicitudO.get());
            res = true;
        }
        return res;
    }

    public Solicitud getSolicitudById(int id) {
        return solicitudRepository.findById(id).orElse(null);
    }
}
