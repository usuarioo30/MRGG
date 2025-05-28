package com.mrgg.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mrgg.entity.Admin;
import com.mrgg.entity.Evento;
import com.mrgg.entity.Juego;
import com.mrgg.entity.TipoCategoria;
import com.mrgg.repository.EventoRepository;
import com.mrgg.repository.JuegoRepository;
import com.mrgg.security.JWTUtils;

import jakarta.transaction.Transactional;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Service
public class JuegoService {

    @Autowired
    private JuegoRepository juegoRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Transactional
    public Juego saveJuego(Juego juego) throws IOException {
        Admin admin = jwtUtils.userLogin();

        if (admin == null) {
            return null;
        }

        juego.setFoto(imagenGeneratedUrl(juego.getNombre()));

        Juego juegoSave = juegoRepository.save(juego);

        return juegoSave;
    }

    @Transactional
    public Juego updateJuego(int id, Juego juego) {
        Optional<Juego> juegoO = juegoRepository.findById(id);

        if (juegoO.isPresent()) {
            Evento evento = jwtUtils.userLogin();

            if (evento != null && evento.getJuego() != null) {
                Juego juegoExistente = juegoO.get();
                juegoExistente.setNombre(juego.getNombre());
                juegoExistente.setDescripcion(juego.getDescripcion());
                juegoExistente.setCategoria(juego.getCategoria());

                return juegoRepository.save(juegoExistente);
            }
        }

        return null;
    }

    @Transactional
    public boolean deleteJuego(int id) {
        Juego juego = juegoRepository.findById(id).orElse(null);
        if (juego != null) {
            Admin admin = jwtUtils.userLogin();
            if (admin != null) {
                List<Evento> eventos = eventoRepository.findByJuegosId(juego.getId());

                eventoRepository.deleteAll(eventos);

                juegoRepository.delete(juego);
                return true;
            }
        }
        return false;
    }

    public Optional<Juego> getJuegoById(int id) {
        return juegoRepository.findById(id);
    }

    public List<Juego> getAllJuegos() {
        return juegoRepository.findAll();
    }

    public List<Juego> getAllJuegosByCategoria(TipoCategoria categoria) {
        return juegoRepository.findByCategoria(categoria);
    }

    @Transactional
    public void juegoPorDefecto() throws IOException {
        if (this.getAllJuegos().size() <= 0) {
            Juego juego1 = new Juego();
            juego1.setNombre("Fc 25");
            juego1.setDescripcion("Juego de fútbol el cuál podrás disfrutar experiencia individual o multijugador");
            juego1.setFoto(imagenGeneratedUrl(juego1.getNombre()));
            juego1.setCategoria(TipoCategoria.DEPORTES);

            juegoRepository.save(juego1);

            Juego juego2 = new Juego();
            juego2.setNombre("NBA 2K25");
            juego2.setDescripcion(
                    "Juego de baloncesto, en el que podrás disfrutar de una experiencia tanto individual como multijugador con tus amigos");
            juego2.setCategoria(TipoCategoria.DEPORTES);
            juego2.setFoto(imagenGeneratedUrl(juego2.getNombre()));

            juegoRepository.save(juego2);

            Juego juego3 = new Juego();
            juego3.setNombre("Madden NFL 25");
            juego3.setDescripcion(
                    "Juego de fútbol americano, en el que podrás disfrutar de una experiencia tanto individual como multijugador");
            juego3.setCategoria(TipoCategoria.DEPORTES);
            juego3.setFoto(imagenGeneratedUrl(juego3.getNombre()));

            juegoRepository.save(juego3);

            Juego juego4 = new Juego();
            juego4.setNombre("F1 25");
            juego4.setDescripcion(
                    "Juego de carreras, en el que podrás disfrutar de una experiencia tanto individual como multijugador");
            juego4.setCategoria(TipoCategoria.CARRERAS);
            juego4.setFoto(imagenGeneratedUrl(juego4.getNombre()));

            juegoRepository.save(juego4);

            Juego juego5 = new Juego();
            juego5.setNombre("Gran Turismo 5");
            juego5.setDescripcion(
                    "Juego de carreras, en el que podrás disfrutar de una experiencia individual o multijugador");
            juego5.setCategoria(TipoCategoria.CARRERAS);
            juego5.setFoto(imagenGeneratedUrl(juego5.getNombre()));

            juegoRepository.save(juego5);

            Juego juego6 = new Juego();
            juego6.setNombre("Forza Horizon 5");
            juego6.setDescripcion(
                    "Juego de carreras , en el que podrás disfrutar de una experiencia individual o multijugador");
            juego6.setCategoria(TipoCategoria.CARRERAS);
            juego6.setFoto(imagenGeneratedUrl(juego6.getNombre()));

            juegoRepository.save(juego6);

            System.out.println("Juegos creados por defecto");

        }
    }

    public String imagenGeneratedUrl(String textoParaImagen) throws IOException {
        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url("https://imdb-com.p.rapidapi.com/search?searchTerm=" + textoParaImagen
                        + "&type=VIDEO_GAME&limit=1")
                .get()
                .addHeader("x-rapidapi-key", "3b93c2fd20msh902f90fac12b234p1d948bjsn7d84a0a40da7")
                .addHeader("x-rapidapi-host", "imdb-com.p.rapidapi.com")
                .build();

        Response response = client.newCall(request).execute();

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(response.body().string());

        // Imagen por defecto si algo falla
        String imageUrl = "https://i.pinimg.com/736x/cb/bb/41/cbbb419ff44445cb13071910a469d5b4.jpg";

        try {
            JsonNode imageNode = rootNode
                    .path("data")
                    .path("mainSearch")
                    .path("edges")
                    .get(0)
                    .path("node")
                    .path("entity")
                    .path("primaryImage")
                    .path("url");

            if (imageNode != null && !imageNode.isMissingNode()) {
                imageUrl = imageNode.asText();
            }
        } catch (Exception e) {
            // Logging opcional o manejo de errores
            System.err.println("Error parsing JSON: " + e.getMessage());
        }

        return imageUrl;
    }

}
