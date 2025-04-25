package com.mrgg.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import okhttp3.OkHttpClient;

import okhttp3.Request;
import okhttp3.Response;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mrgg.entity.Actor;
import com.mrgg.entity.ActorLogin;
import com.mrgg.service.ActorService;
import com.mrgg.security.JWTUtils;

@RestController
public class ActorController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTUtils JWTUtils;

    @Autowired
    private ActorService actorService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody ActorLogin actorLogin) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(actorLogin.getUsername(), actorLogin.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = JWTUtils.generateToken(authentication);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/actorLogueado")
    public ResponseEntity<Actor> login() {
        Actor a = JWTUtils.userLogin();
        if (a == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(a);
    }

    @GetMapping("/actorExiste/{username}")
    public ResponseEntity<Boolean> checkUserExists(@PathVariable String username) {
        boolean exists = actorService.findByUsername(username).isPresent();
        return ResponseEntity.ok(exists);
    }

    public String imagenGeneratedUrl(String textoParaImagen) throws IOException {
        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url("https://free-images-api.p.rapidapi.com/v2/" + textoParaImagen + "/1")
                .get()
                .header("x-rapidapi-key", "53dc8b2a7emsh438d417686c202cp142797jsn2f0a25e199b5")
                .header("x-rapidapi-host", "free-images-api.p.rapidapi.com")
                .build();

        Response response = client.newCall(request).execute();

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(response.body().string());
        JsonNode resultsNode = rootNode.path("results");

        String imageUrl = "https://www.gipuzkoa.eus/documents/20933/32665092/03-deportes_3.png.jpg/e35046ab-3cfd-d709-0d65-6b1221001f3b?t=1637930583543";
        if (resultsNode.isArray() && resultsNode.size() > 0) {
            JsonNode firstResult = resultsNode.get(0);
            if (firstResult.has("image")) {
                imageUrl = firstResult.path("image").asText();
            }
        }

        return imageUrl;
    }
}
