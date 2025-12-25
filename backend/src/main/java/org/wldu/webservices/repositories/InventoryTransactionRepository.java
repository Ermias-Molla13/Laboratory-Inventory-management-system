package org.wldu.webservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wldu.webservices.enities.InventoryTransaction;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryTransactionRepository
        extends JpaRepository<InventoryTransaction, Long> {

    // ✅ Correct for @ManyToOne Equipment
    List<InventoryTransaction> findByEquipment_Id(Long equipmentId);

    // ✅ Correct for @ManyToOne Chemical
    List<InventoryTransaction> findByChemical_Id(Long chemicalId);

    // ✅ Works with LocalDateTime
    List<InventoryTransaction> findTop5ByOrderByTransactionDateDesc();

    // ✅ Correct date range query
    List<InventoryTransaction> findByTransactionDateBetween(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    // ✅ transactionType is String in entity
    List<InventoryTransaction> findByTransactionType(String transactionType);
}
