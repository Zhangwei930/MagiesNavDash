package com.magies.backend.service;

import com.magies.backend.entity.MailLog;
import com.magies.backend.repository.MailLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class MailGatewayClient {

    private static final Logger log = LoggerFactory.getLogger(MailGatewayClient.class);

    private final RestClient restClient;
    private final MailLogRepository mailLogRepository;
    private final String gatewayUrl;

    public MailGatewayClient(
            MailLogRepository mailLogRepository,
            @Value("${magies.mail-gateway.url}") String gatewayUrl
    ) {
        this.mailLogRepository = mailLogRepository;
        this.gatewayUrl = gatewayUrl;
        this.restClient = RestClient.create();
    }

    public void sendVerificationCode(String email, String code) {
        String subject = "【Magies Hub】登录验证码";
        String body = "您的验证码是：" + code + "\n有效期：5 分钟\n如非本人操作，请忽略此邮件。";
        send(email, "VERIFY_CODE", subject, body);
    }

    public void send(String email, String type, String subject, String body) {
        MailLog mailLog = new MailLog();
        mailLog.setEmail(email);
        mailLog.setMailType(type);
        mailLog.setSubject(subject);

        try {
            Map<?, ?> response = restClient.post()
                    .uri(gatewayUrl + "/api/send")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "email", email,
                            "type", type,
                            "subject", subject,
                            "body", body
                    ))
                    .retrieve()
                    .body(Map.class);

            boolean ok = response != null && Boolean.TRUE.equals(response.get("success"));
            mailLog.setStatus(ok ? "SENT" : "FAILED");
            mailLog.setProviderMsg(response != null ? String.valueOf(response.get("message")) : "empty response");
            if (!ok) {
                log.warn("Mail gateway failed for {}: {}", email, mailLog.getProviderMsg());
            }
        } catch (Exception e) {
            log.error("Mail gateway unreachable for {}: {}", email, e.getMessage());
            mailLog.setStatus("FAILED");
            mailLog.setProviderMsg("gateway offline: " + e.getMessage());
            mailLogRepository.save(mailLog);
            throw new IllegalStateException("邮件服务不可用，请稍后重试");
        }

        mailLogRepository.save(mailLog);
        if ("FAILED".equals(mailLog.getStatus())) {
            throw new IllegalStateException(mailLog.getProviderMsg() == null ? "邮件发送失败" : mailLog.getProviderMsg());
        }
    }
}
