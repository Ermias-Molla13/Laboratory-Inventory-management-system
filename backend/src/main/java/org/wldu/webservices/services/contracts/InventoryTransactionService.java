package org.wldu.webservices.services.contracts;

import org.wldu.webservices.enities.InventoryTransaction;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InventoryTransactionService {

    InventoryTransaction saveTransaction(InventoryTransaction transaction);

    List<InventoryTransaction> getAllTransactions();

    Optional<InventoryTransaction> getTransactionById(Long id);

    List<InventoryTransaction> getTransactionsByEquipment(Long equipmentId);

    List<InventoryTransaction> getTransactionsByChemical(Long chemicalId);

    List<InventoryTransaction> getTransactionsByType(String transactionType);

    List<InventoryTransaction> getTransactionsByDateRange(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    void deleteTransaction(Long id);
}
