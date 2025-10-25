package com.karamasala.ecommerce.controller;

import com.karamasala.ecommerce.dto.AuthRequest;
import com.karamasala.ecommerce.dto.RegisterRequest;
import com.karamasala.ecommerce.dto.UserDto;
import com.karamasala.ecommerce.exception.ResourceNotFoundException;
import com.karamasala.ecommerce.exception.UnauthorizedException;
import com.karamasala.ecommerce.model.User;
import com.karamasala.ecommerce.repository.UserRepository;
import com.karamasala.ecommerce.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;
    private final UserRepository users;

    public AuthController(AuthService auth, UserRepository users) {
        this.auth = auth;
        this.users = users;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterRequest req) {
        User u = auth.register(req);
        return ResponseEntity.ok(new UserDto(u.getId(), u.getUsername(), u.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody AuthRequest req, HttpServletResponse response) {
        User u = auth.login(req, response);
        return ResponseEntity.ok(new UserDto(u.getId(), u.getUsername(), u.getEmail()));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            throw new UnauthorizedException("You must be logged in to access profile");
        }
        var u = users.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(new UserDto(u.getId(), u.getUsername(), u.getEmail()));
    }

    @PostMapping("/logout")
    public String logout(HttpServletResponse response) {
        Cookie jwtCookie = new Cookie("Authentication", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0);
        response.addCookie(jwtCookie);

        Cookie csrfCookie = new Cookie("XSRF-TOKEN", null);
        csrfCookie.setHttpOnly(false);
        csrfCookie.setSecure(true);
        csrfCookie.setPath("/");
        csrfCookie.setMaxAge(0);
        response.addCookie(csrfCookie);

        return "Logged out successfully";
    }
}
