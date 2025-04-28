package com.g7.brasfi.services;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.g7.brasfi.dto.UserDTO;
import com.g7.brasfi.entities.User;
import com.g7.brasfi.repositories.UserRepository;
import com.g7.brasfi.services.exceptions.DatabaseException;
import com.g7.brasfi.services.exceptions.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class UserService {

	@Autowired
	private UserRepository repository;
	
	public List<User> findAll(){
		return repository.findAll();
	}
	
	public User findById(Long id) {
		Optional<User> user = repository.findById(id);
		return user.orElseThrow(() -> new ResourceNotFoundException(id));
	}
	
    public Optional<User> findbyEmail(String email) {
        return repository.findByEmail(email);
    }

    public Optional<User> findByCpf(String cpf) {
        return repository.findByCpf(cpf);
    }
	
    public boolean existsByCpf(String cpf) {
    	return repository.existsByCpf(cpf);
    }
    
	public User insert(User user) {
		if (repository.existsByCpf(user.getCpf())) {
			throw new DatabaseException("CPF já cadastrado: " + user.getCpf());
		}
	    if (isUnderage(user.getDataNascimento())) {
	        throw new DatabaseException("A idade mínima para cadastro é 18 anos.");
	    }
		return repository.save(user);
	}
	
	public void delete(Long id) {
		try {
			if (!repository.existsById(id)) {
				System.out.println("User not found!");
				throw new ResourceNotFoundException(id);
			}
			repository.deleteById(id);
		}
		catch (DataIntegrityViolationException e) {
			throw new DatabaseException(e.getMessage());
		}
	}
	
	@Transactional
	public User update(UserDTO userDTO, Long id) {
	    try {
	        User entity = repository.getReferenceById(id);
	        updateData(entity, userDTO);
	        return repository.save(entity);
	    } catch (EntityNotFoundException e) {
	        throw new ResourceNotFoundException(id);
	    }
	}

	
	private void updateData(User entity, UserDTO dto) {
	    entity.setName(dto.getName());
	    entity.setPhone(dto.getPhone());
	    entity.setEmail(dto.getEmail());
	    entity.setDataNascimento(dto.getDataNascimento());
	    entity.setGenero(dto.getGenero());
	    entity.setBiografia(dto.getBiografia());
	}

	
	public User convertToEntity(UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setPhone(userDTO.getPhone());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
        user.setCpf(userDTO.getCpf());
        user.setDataNascimento(userDTO.getDataNascimento());
        
        if (userDTO.getGenero() != null) {
            user.setGenero(userDTO.getGenero());
        }
        if (userDTO.getBiografia() != null) {
            user.setBiografia(userDTO.getBiografia());
        }

        return user;
    }
	
	private boolean isUnderage(LocalDate dataNascimento) {
	    LocalDate hoje = LocalDate.now();
	    Period idade = Period.between(dataNascimento, hoje);
	    return idade.getYears() < 18;
	}
}
