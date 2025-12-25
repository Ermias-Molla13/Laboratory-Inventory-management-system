package org.wldu.webservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wldu.webservices.enities.InventoryTransaction;
import org.wldu.webservices.enities.TransactionType;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    // Find all transactions for a specific equipment
    List<InventoryTransaction> findByEquipmentId(Long equipmentId);

    // Find all transactions for a specific chemical
    List<InventoryTransaction> findByChemicalId(Long chemicalId);

    // Find the 5 most recent transactions
    // Make sure your entity has a field named 'transactionDate' (or rename here to match your entity)
    List<InventoryTransaction> findTop5ByOrderByTransactionDateDesc();

    // Find transactions where quantity is less than minQuantity
    List<InventoryTransaction> findByQuantityLessThan(int minQuantity);

    // Find transactions by date range
    List<InventoryTransaction> findByTransactionDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );

    // Find transactions by type (IN / OUT / ADJUSTMENT)
    List<InventoryTransaction> findByTransactionType(TransactionType transactionType);
}
