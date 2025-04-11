package com.mrgg.entity;

import java.sql.Date;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Evento extends DomainEntity {
    @NotBlank
    private String codigo_sala;

    @Min(0)
    private int num_usuario;

    @NotBlank
    private EstadoEvento estado;

    @NotBlank
    private Date fecha_inicio;

    @NotBlank
    private String comentario;

    @OneToMany
    private Set<Solicitud> solicitudes;

    // Relacion muchos a uno con juego
    @ManyToOne
    private Juego juego;

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

    public Set<Solicitud> getSolicitudes() {
        return solicitudes;
    }

    public void setSolicitudes(Set<Solicitud> solicitudes) {
        this.solicitudes = solicitudes;
    }

    public Juego getJuego() {
        return juego;
    }

    public void setJuego(Juego juego) {
        this.juego = juego;
    }
}
