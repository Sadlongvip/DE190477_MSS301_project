package com.fuwork.inventoryservice.service;

import com.fuwork.inventoryservice.dto.topping.ToppingRequest;
import com.fuwork.inventoryservice.dto.topping.ToppingResponse;
import com.fuwork.inventoryservice.exception.ApiException;
import com.fuwork.inventoryservice.model.Topping;
import com.fuwork.inventoryservice.repository.ToppingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ToppingService {

    private final ToppingRepository toppingRepository;

    @Transactional
    public ToppingResponse createTopping(ToppingRequest request) {
        String trimmedName = request.getName().trim();
        if (toppingRepository.existsByName(trimmedName)) {
            throw ApiException.conflict("Tên topping đã tồn tại: " + trimmedName);
        }

        Topping topping = new Topping();
        topping.setName(trimmedName);
        topping.setPrice(request.getPrice());

        Topping saved = toppingRepository.save(topping);
        log.info("Topping created: id={}, name={}", saved.getId(), saved.getName());
        return ToppingResponse.from(saved);
    }

    public ToppingResponse getToppingById(Long id) {
        return ToppingResponse.from(findTopping(id));
    }

    public List<ToppingResponse> getAllToppings() {
        return toppingRepository.findAll(Sort.by("id").ascending())
                .stream()
                .map(ToppingResponse::from)
                .toList();
    }

    public List<ToppingResponse> searchToppings(String keyword) {
        List<Topping> toppings = (keyword == null || keyword.isBlank())
                ? toppingRepository.findAll(Sort.by("id").ascending())
                : toppingRepository.findByNameContainingIgnoreCase(keyword.trim());
        return toppings.stream().map(ToppingResponse::from).toList();
    }

    @Transactional
    public ToppingResponse updateTopping(Long id, ToppingRequest request) {
        Topping topping = findTopping(id);
        String trimmedName = request.getName().trim();

        if (toppingRepository.existsByNameAndIdNot(trimmedName, id)) {
            throw ApiException.conflict("Tên topping đã được sử dụng: " + trimmedName);
        }

        topping.setName(trimmedName);
        topping.setPrice(request.getPrice());

        Topping updated = toppingRepository.save(topping);
        log.info("Topping updated: id={}, name={}", updated.getId(), updated.getName());
        return ToppingResponse.from(updated);
    }

    @Transactional
    public void deleteTopping(Long id) {
        Topping topping = findTopping(id);
        toppingRepository.delete(topping);
        log.info("Topping deleted: id={}", id);
    }

    private Topping findTopping(Long id) {
        return toppingRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy topping với id: " + id));
    }
}
