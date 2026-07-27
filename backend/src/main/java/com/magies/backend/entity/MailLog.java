package com.magies.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "mail_log")
public class MailLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String mailType;

    private String subject;

    @Column(nullable = false)
    private String status;

    private String providerMsg;
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMailType() { return mailType; }
    public void setMailType(String mailType) { this.mailType = mailType; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getProviderMsg() { return providerMsg; }
    public void setProviderMsg(String providerMsg) { this.providerMsg = providerMsg; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
