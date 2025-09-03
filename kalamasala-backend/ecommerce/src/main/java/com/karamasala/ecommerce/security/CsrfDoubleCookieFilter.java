package com.karamasala.ecommerce.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class CsrfDoubleCookieFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        // Skip CSRF validation for authentication endpoints
        if (path.startsWith("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Only enforce CSRF on state-changing methods
        String method = request.getMethod();
        if (method.equalsIgnoreCase("POST") ||
                method.equalsIgnoreCase("PUT") ||
                method.equalsIgnoreCase("DELETE") ||
                method.equalsIgnoreCase("PATCH")) {

            String csrfHeader = request.getHeader("X-XSRF-TOKEN");
            String csrfCookie = extractCookie(request.getCookies(), "XSRF-TOKEN");

            if (csrfHeader == null || csrfCookie == null || !csrfHeader.equals(csrfCookie)) {
                response.sendError(HttpStatus.FORBIDDEN.value(), "Invalid CSRF token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractCookie(Cookie[] cookies, String name) {
        if (cookies == null) return null;
        for (Cookie c : cookies) {
            if (name.equals(c.getName())) {
                return c.getValue();
            }
        }
        return null;
    }
}
