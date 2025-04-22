package com.mrgg.service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import com.mrgg.entity.Actor;
import com.mrgg.repository.ActorRepository;

@Service
public class ActorService implements UserDetailsService {

    @Autowired
    private ActorRepository actorRepository;

    @Transactional
    public Actor saveActor(Actor actor) {
        return actorRepository.save(actor);
    }

    public Optional<Actor> findByUsername(String username) {
        return actorRepository.findByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Actor> actorO = this.findByUsername(username);
        if (actorO.isPresent()) {
            Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
            authorities.add(new SimpleGrantedAuthority(actorO.get().getRol().toString()));
            User user = new User(actorO.get().getUsername(), actorO.get().getPassword(), authorities);
            return user;
        } else {
            throw new UsernameNotFoundException("Username no encontrado");
        }
    }

    
}
