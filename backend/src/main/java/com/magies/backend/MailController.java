package com.magies.backend;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/mail")
public class MailController {

    @PostMapping
    public Map<String, Object> sendVerification(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");
        String code = (String) request.get("code") != null ? (String) request.get("code") : "123456";

        if (email == null || code.length() != 6) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "验证码格式错误");
            return error;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "验证码邮件已发送（模拟 Mail Gateway + Google SMTP）");
        response.put("template", "【Magies Hub】您的验证码是：" + code + "\n有效期：5分钟\n如非本人操作，请忽略此邮件。");
        return response;
    }
}
