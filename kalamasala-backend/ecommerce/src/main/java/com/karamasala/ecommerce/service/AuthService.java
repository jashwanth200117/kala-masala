package com.karamasala.ecommerce.service;

import com.karamasala.ecommerce.dto.AuthRequest;
import com.karamasala.ecommerce.dto.RegisterRequest;
import com.karamasala.ecommerce.model.User;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    User register(RegisterRequest req);
    User login(AuthRequest req, HttpServletResponse response);
}
