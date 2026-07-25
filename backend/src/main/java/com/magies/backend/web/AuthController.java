package com.magies.backend.web;

import com.magies.backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/send-code")
    public Map<String, Object> sendCode(@RequestBody Map<String, String> body) {
        return authService.sendCode(body.get("email"));
    }

    @PostMapping("/verify")
    public Map<String, Object> verify(@RequestBody Map<String, String> body) {
        return authService.verifyAndLogin(body.get("email"), body.get("code"));
    }
}
