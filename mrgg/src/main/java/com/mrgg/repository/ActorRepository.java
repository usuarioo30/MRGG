package com.mrgg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrgg.entity.Actor;

@Repository
public interface ActorRepository extends JpaRepository<Actor, Integer> {
    
}
