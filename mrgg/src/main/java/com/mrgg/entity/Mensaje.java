package com.mrgg.entity;

import java.sql.Date;
import java.util.List;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Mensaje extends DomainEntity {

    private Date fechaEnvio;

    @Length(min = 0, max = 100)
    private String asunto;

    @NotBlank
    private String cuerpo;

    private List<String> usuarioQueLee;

    private boolean esAdmin;

    public Mensaje() {
        super();
    }

    public Date getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(Date fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getCuerpo() {
        return cuerpo;
    }

    public void setCuerpo(String cuerpo) {
        this.cuerpo = cuerpo;
    }

    public List<String> getUsuarioQueLee() {
        return usuarioQueLee;
    }

    public void setUsuarioQueLee(List<String> usuarioQueLee) {
        this.usuarioQueLee = usuarioQueLee;
    }

    public boolean isEsAdmin() {
        return esAdmin;
    }

    public void setEsAdmin(boolean esAdmin) {
        this.esAdmin = esAdmin;
    }

}
