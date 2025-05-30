package com.g7.brasfi.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g7.brasfi.domain.Video;
import com.g7.brasfi.repositories.VideoRepository;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    // Listar todos os vídeos
    public List<Video> listarTodos() {
        return videoRepository.findAll();
    }

    // Salvar um vídeo novo ou atualizar
    public Video salvar(Video video) {
        return videoRepository.save(video);
    }

    // Buscar vídeo por ID
    public Optional<Video> buscarPorId(String id) {
        return videoRepository.findById(id);
    }

    // Atualizar vídeo existente
    public Optional<Video> atualizar(String id, Video videoDetalhes) {
        return videoRepository.findById(id).map(video -> {
            video.setTitulo(videoDetalhes.getTitulo());
            video.setUrl(videoDetalhes.getUrl());
            return videoRepository.save(video);
        });
    }

    // Excluir vídeo por ID com verificação
    public boolean excluir(String id) {
        return videoRepository.findById(id).map(video -> {
            videoRepository.deleteById(id);
            return true;
        }).orElse(false);
    }

    // Excluir todos os vídeos
    public void excluirTodos() {
        videoRepository.deleteAll();
    }

}
