package com.mrgg.entity;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Evento extends DomainEntity {
    @NotBlank
    private String codigo_sala;

    @Min(2)
    private int num_jugadores;

    @NotNull
    private EstadoEvento estado;

    @NotNull
    private LocalDateTime fecha_inicio;

    @NotBlank
    private String descripcion;

    @OneToMany
    private Set<Solicitud> solicitudes;

    @ManyToOne
    private Juego juegos;

    public Evento() {
        super();
    }

    public String getCodigo_sala() {
        return codigo_sala;
    }

    public void setCodigo_sala(String codigo_sala) {
        this.codigo_sala = codigo_sala;
    }

    public int getNum_jugadores() {
        return num_jugadores;
    }

    public void setNum_jugadores(int num_jugadores) {
        this.num_jugadores = num_jugadores;
    }

    public EstadoEvento getEstado() {
        return estado;
    }

    public void setEstado(EstadoEvento estado) {
        this.estado = estado;
    }

    public LocalDateTime getFecha_inicio() {
        return fecha_inicio;
    }

    public void setFecha_inicio(LocalDateTime fecha_inicio) {
        this.fecha_inicio = fecha_inicio;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Set<Solicitud> getSolicitudes() {
        return solicitudes;
    }

    public void setSolicitudes(Set<Solicitud> solicitudes) {
        this.solicitudes = solicitudes;
    }

    public Juego getJuego() {
        return juegos;
    }

    public void setJuego(Juego juegos) {
        this.juegos = juegos;
    }
}
