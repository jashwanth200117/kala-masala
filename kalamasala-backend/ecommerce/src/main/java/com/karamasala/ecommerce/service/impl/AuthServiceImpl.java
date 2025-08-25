package com.karamasala.ecommerce.service.impl;

import com.karamasala.ecommerce.dto.AuthRequest;
import com.karamasala.ecommerce.dto.RegisterRequest;
import com.karamasala.ecommerce.model.User;
import com.karamasala.ecommerce.repository.UserRepository;
import com.karamasala.ecommerce.security.JwtUtil;
import com.karamasala.ecommerce.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwt;

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
    public String login(AuthRequest req) {
        try {
            var authToken = new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword());
            authManager.authenticate(authToken);
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // create JWT
        var user = users.findByEmail(req.getEmail()).orElseThrow();
        return jwt.generateToken(
                user.getEmail(),
                Map.of("uid", user.getId(), "roles", user.getRoles(), "username", user.getUsername())
        );
    }
}
