package com.g7.brasfi.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.g7.brasfi.domain.user.User;
import com.g7.brasfi.dto.UserDTO;
import com.g7.brasfi.repositories.UserRepository;
import com.g7.brasfi.services.exceptions.ResourceNotFoundException;

@Service
public class UserService {

	@Autowired
    private UserRepository repository;

    public User findById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public User update(String id, UserDTO dto) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getCpf() != null) user.setCpf(dto.getCpf());
        if (dto.getDataNascimento() != null) user.setDataNascimento(dto.getDataNascimento());
        if (dto.getGenero() != null) user.setGenero(dto.getGenero());
        if (dto.getBiografia() != null) user.setBiografia(dto.getBiografia());
        if (dto.getEmail() != null) user.setLogin(dto.getEmail());

        return user;
    }
}
