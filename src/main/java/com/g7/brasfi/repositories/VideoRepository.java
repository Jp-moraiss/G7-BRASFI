package com.g7.brasfi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.g7.brasfi.domain.Video;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
}

