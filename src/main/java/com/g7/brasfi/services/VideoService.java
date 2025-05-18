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

    public List<Video> listarTodos() {
        return videoRepository.findAll();
    }

    public Video salvar(Video video) {
        return videoRepository.save(video);
    }

    public void excluir(Long id) {
        videoRepository.deleteById(id);
    }

    public Optional<Video> buscarPorId(Long id) {
        return videoRepository.findById(id);
    }
    
    public void excluirTodos() {
    	videoRepository.deleteAll();
    }
}
