package com.fuwork.gateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static com.fuwork.gateway.filter.UserHeaderFilter.forwardUserInfo;
import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.uri;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.web.servlet.function.RequestPredicates.path;

@Configuration(proxyBeanMethods = false)
public class Routes {

    @Value("${services.customer.url:http://localhost:8081}")
    private String customerServiceUrl;

    /**
     * Định tuyến các API liên quan đến Authentication và Quản lý tài khoản sang customer-service (port 8081)
     */
    @Bean
    public RouterFunction<ServerResponse> customerServiceRoute() {
        return route("customer_service")
                .route(path("/api/auth/**").or(path("/api/accounts/**")), http())
                .before(uri(customerServiceUrl))
                .before(forwardUserInfo())
                .build();
    }
}