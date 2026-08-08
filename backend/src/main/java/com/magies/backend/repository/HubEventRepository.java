package com.magies.backend.repository;

import com.magies.backend.entity.HubEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HubEventRepository extends JpaRepository<HubEvent, Long> {
}
