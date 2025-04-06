package com.mrgg.entity;

public abstract class Actor extends DomainEntity {
    private int actor_id;
    private String nombre;
    private String correo_electronico;
    private String clave_segura;
    private int chat_id;
    private String foto;
    private String username;
    private String password;
    private String telefono;
    private boolean baneado;

    public Actor() {
        
    }

    public int getActor_id() {
        return actor_id;
    }

    public void setActor_id(int actor_id) {
        this.actor_id = actor_id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo_electronico() {
        return correo_electronico;
    }

    public void setCorreo_electronico(String correo_electronico) {
        this.correo_electronico = correo_electronico;
    }

    public String getClave_segura() {
        return clave_segura;
    }

    public void setClave_segura(String clave_segura) {
        this.clave_segura = clave_segura;
    }

    public int getChat_id() {
        return chat_id;
    }

    public void setChat_id(int chat_id) {
        this.chat_id = chat_id;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public boolean getBaneado() {
        return baneado;
    }

    public void setBaneado(boolean baneado) {
        this.baneado = baneado;
    }
}