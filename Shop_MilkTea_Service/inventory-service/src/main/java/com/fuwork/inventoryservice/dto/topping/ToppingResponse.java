package com.fuwork.inventoryservice.dto.topping;

import com.fuwork.inventoryservice.model.Topping;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ToppingResponse {

    private Long id;
    private String name;
    private double price;

    public static ToppingResponse from(Topping topping) {
        if (topping == null) {
            return null;
        }
        return ToppingResponse.builder()
                .id(topping.getId())
                .name(topping.getName())
                .price(topping.getPrice())
                .build();
    }
}
