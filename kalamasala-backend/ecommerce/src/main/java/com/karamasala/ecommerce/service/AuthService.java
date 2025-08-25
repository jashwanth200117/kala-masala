package com.karamasala.ecommerce.service;

import com.karamasala.ecommerce.dto.AuthRequest;
import com.karamasala.ecommerce.dto.RegisterRequest;
import com.karamasala.ecommerce.model.User;

public interface AuthService {
    User register(RegisterRequest req);
    String login(AuthRequest req);
}
