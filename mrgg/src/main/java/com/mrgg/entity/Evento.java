package com.mrgg.entity;

import java.sql.Date;

public class Evento extends DomainEntity {
    private String codigo_sala;
    private int num_usuario;
    private EstadoEvento estado;
    private Date fecha_inicio;
    private String comentario;

    public Evento() {
        super();
    }

    public String getCodigo_sala() {
        return codigo_sala;
    }

    public void setCodigo_sala(String codigo_sala) {
        this.codigo_sala = codigo_sala;
    }

    public int getNum_usuario() {
        return num_usuario;
    }

    public void setNum_usuario(int num_usuario) {
        this.num_usuario = num_usuario;
    }

    public EstadoEvento getEstado() {
        return estado;
    }

    public void setEstado(EstadoEvento estado) {
        this.estado = estado;
    }

    public Date getFecha_inicio() {
        return fecha_inicio;
    }

    public void setFecha_inicio(Date fecha_inicio) {
        this.fecha_inicio = fecha_inicio;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}
