package com.mrgg.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mrgg.entity.Actor;
import com.mrgg.repository.ActorRepository;

@Service
public class ActorService {
    private ActorRepository actorRepository;

    public Optional<Actor> findByUsername(String username) {
        return actorRepository.findByUsername(username);
    }
}
