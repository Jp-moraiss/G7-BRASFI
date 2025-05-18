package com.g7.brasfi.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.g7.brasfi.domain.Video;
import com.g7.brasfi.services.VideoService;

@RestController
@RequestMapping("/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;

    // Listar todos os vídeos
    @GetMapping
    public List<Video> listarTodos() {
        return videoService.listarTodos();
    }

    // Buscar vídeo por id
    @GetMapping("/{id}")
    public ResponseEntity<Video> buscarPorId(@PathVariable Long id) {
        Optional<Video> video = videoService.buscarPorId(id);
        if (video.isPresent()) {
            return ResponseEntity.ok(video.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Salvar um vídeo novo
    @PostMapping
    public Video salvar(@RequestBody Video video) {
        return videoService.salvar(video);
    }

    // Atualizar um vídeo existente
    @PutMapping("/{id}")
    public ResponseEntity<Video> atualizar(@PathVariable Long id, @RequestBody Video videoDetalhes) {
        Optional<Video> videoOptional = videoService.buscarPorId(id);
        if (!videoOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Video video = videoOptional.get();
        video.setTitulo(videoDetalhes.getTitulo());
        video.setUrl(videoDetalhes.getUrl());

        Video videoAtualizado = videoService.salvar(video);
        return ResponseEntity.ok(videoAtualizado);
    }

    // Deletar um vídeo pelo id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Optional<Video> video = videoService.buscarPorId(id);
        if (!video.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        videoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping
    public ResponseEntity<Void> deletarTodos(){
    	videoService.excluirTodos();
    	return ResponseEntity.noContent().build();
    }
}
