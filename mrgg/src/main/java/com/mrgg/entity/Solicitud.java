package com.mrgg.entity;

public class Solicitud extends DomainEntity {
    private EstadoSolicitud estado;

    public Solicitud() {
        super();
    }

    public Solicitud(EstadoSolicitud estado) {
        this.estado = estado;
    }

    public EstadoSolicitud getEstado() {
        return estado;
    }

    public void setEstado(EstadoSolicitud estado) {
        this.estado = estado;
    }
}