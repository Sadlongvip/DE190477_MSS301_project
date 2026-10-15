package com.fuwork.inventoryservice.repository;

import com.fuwork.inventoryservice.model.CategoryTea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryTeaRepository extends JpaRepository<CategoryTea, Long> {

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);

    List<CategoryTea> findByNameContainingIgnoreCase(String keyword);
}
