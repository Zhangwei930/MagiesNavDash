package com.magies.backend.service;

import com.magies.backend.entity.SysUser;
import com.magies.backend.repository.SysUserRepository;
import com.magies.backend.security.JwtService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AuthService {

    private final SysUserRepository userRepository;
    private final VerificationCodeService codeService;
    private final MailGatewayClient mailGatewayClient;
    private final JwtService jwtService;

    public AuthService(
            SysUserRepository userRepository,
            VerificationCodeService codeService,
            MailGatewayClient mailGatewayClient,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.codeService = codeService;
        this.mailGatewayClient = mailGatewayClient;
        this.jwtService = jwtService;
    }

    public Map<String, Object> sendCode(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("请输入有效邮箱");
        }
        String normalized = email.trim().toLowerCase();
        String code = codeService.generateAndStore(normalized);
        mailGatewayClient.sendVerificationCode(normalized, code);
        return Map.of(
                "success", true,
                "message", "验证码已发送，请查收邮件（5 分钟内有效）"
        );
    }

    @Transactional
    public Map<String, Object> verifyAndLogin(String email, String code) {
        if (email == null || code == null || code.length() != 6) {
            throw new IllegalArgumentException("请输入 6 位验证码");
        }
        String normalized = email.trim().toLowerCase();
        if (!codeService.verify(normalized, code)) {
            throw new IllegalArgumentException("验证码错误或已过期");
        }

        SysUser user = userRepository.findByEmail(normalized).orElseGet(() -> {
            SysUser created = new SysUser();
            created.setEmail(normalized);
            created.setDisplayName(normalized.split("@")[0]);
            created.setRole("USER");
            created.setStatus("ACTIVE");
            created.setCreatedAt(Instant.now());
            created.setUpdatedAt(Instant.now());
            return userRepository.save(created);
        });

        user.setLastLoginAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        String token = jwtService.issueToken(user.getId(), user.getEmail(), user.getRole());

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("success", true);
        payload.put("message", "登录成功");
        payload.put("token", token);
        payload.put("user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "displayName", user.getDisplayName() == null ? user.getEmail() : user.getDisplayName(),
                "role", user.getRole()
        ));
        return payload;
    }
}
