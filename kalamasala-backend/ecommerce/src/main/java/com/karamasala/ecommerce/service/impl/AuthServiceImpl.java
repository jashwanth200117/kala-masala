package com.karamasala.ecommerce.service.impl;

import com.karamasala.ecommerce.dto.AuthRequest;
import com.karamasala.ecommerce.dto.RegisterRequest;
import com.karamasala.ecommerce.model.User;
import com.karamasala.ecommerce.repository.UserRepository;
import com.karamasala.ecommerce.security.JwtUtil;
import com.karamasala.ecommerce.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwt;
    private final SecureRandom random = new SecureRandom();

    public AuthServiceImpl(UserRepository users, PasswordEncoder encoder,
                           AuthenticationManager authManager, JwtUtil jwt) {
        this.users = users;
        this.encoder = encoder;
        this.authManager = authManager;
        this.jwt = jwt;
    }

    @Override
    public User register(RegisterRequest req) {
        if (users.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (users.existsByUsername(req.getUsername())) {
            throw new IllegalArgumentException("Username already in use");
        }

        User u = User.builder()
                .email(req.getEmail())
                .username(req.getUsername())
                .password(encoder.encode(req.getPassword()))
                .roles(Set.of("ROLE_USER"))
                .build();

        return users.save(u);
    }

    @Override
    public User login(AuthRequest req, HttpServletResponse response) {
        try {
            var authToken = new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword());
            authManager.authenticate(authToken);
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid email or password");
        }

        var user = users.findByEmail(req.getEmail()).orElseThrow();

        // 1. Generate JWT
        String jwtToken = jwt.generateToken(
                user.getEmail(),
                Map.of("uid", user.getId(), "roles", user.getRoles(), "username", user.getUsername())
        );

        // 2. Generate CSRF token (random string)
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String csrfToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        // 3. Set Authentication cookie (HttpOnly, Secure, SameSite=Strict)
        Cookie authCookie = new Cookie("Authentication", jwtToken);
        authCookie.setHttpOnly(true);
        authCookie.setSecure(true); // only over HTTPS
        authCookie.setPath("/");
        authCookie.setMaxAge(24 * 60 * 60);
        response.addCookie(authCookie);

        // 4. Set CSRF cookie (accessible by JS)
        Cookie csrfCookie = new Cookie("XSRF-TOKEN", csrfToken);
        csrfCookie.setHttpOnly(false);
        csrfCookie.setSecure(true);
        csrfCookie.setPath("/");
        csrfCookie.setMaxAge(24 * 60 * 60);
        response.addCookie(csrfCookie);

        return user;
    }
}
