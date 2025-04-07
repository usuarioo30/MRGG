package com.mrgg.entity;

import jakarta.persistence.Entity;

@Entity
public class Solicitud extends DomainEntity {

    private EstadoSolicitud estado;

    public Solicitud() {
        super();
    }


    public EstadoSolicitud getEstado() {
        return estado;
    }

    public void setEstado(EstadoSolicitud estado) {
        this.estado = estado;
    }
}