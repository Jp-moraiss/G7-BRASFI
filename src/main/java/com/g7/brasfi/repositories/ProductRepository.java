package com.g7.brasfi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.g7.brasfi.domain.product.Product;

public interface ProductRepository extends JpaRepository<Product, String>{

}
