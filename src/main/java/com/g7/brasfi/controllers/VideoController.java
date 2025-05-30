package com.g7.brasfi.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.g7.brasfi.domain.Video;
import com.g7.brasfi.services.VideoService;

@RestController
@RequestMapping("/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @GetMapping
    public ResponseEntity<List<Video>> listarTodos() {
        List<Video> videos = videoService.listarTodos();
        return videos.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(videos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Video> buscarPorId(@PathVariable String id) {
        return videoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Video> salvar(@RequestBody Video video) {
        return ResponseEntity.ok(videoService.salvar(video));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Video> atualizar(@PathVariable String id, @RequestBody Video videoDetalhes) {
        return videoService.atualizar(id, videoDetalhes)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        if (videoService.excluir(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletarTodos() {
        videoService.excluirTodos();
        return ResponseEntity.noContent().build();
    }
}
