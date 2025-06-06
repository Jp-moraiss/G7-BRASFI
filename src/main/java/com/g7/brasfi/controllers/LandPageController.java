package com.g7.brasfi.controllers;

import com.g7.brasfi.domain.landpage.LandPage;
import com.g7.brasfi.repositories.LandPageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/landpages")
public class LandPageController {

    @Autowired
    private LandPageRepository repository;

    @GetMapping
    public List<LandPage> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<LandPage> getById(@PathVariable String id) {
        return repository.findById(id);
    }

    @PostMapping
    public LandPage create(@RequestBody LandPage landPage) {
        return repository.save(landPage);
    }

    @PutMapping("/{id}")
    public LandPage update(@PathVariable String id, @RequestBody LandPage landPage) {
        landPage.setId(id);
        return repository.save(landPage);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repository.deleteById(id);
    }
}
