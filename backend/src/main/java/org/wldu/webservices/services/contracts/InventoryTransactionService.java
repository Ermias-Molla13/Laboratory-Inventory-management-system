package org.wldu.webservices.services.contracts;

import org.wldu.webservices.enities.InventoryTransaction;
import org.wldu.webservices.enities.TransactionType;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface InventoryTransactionService {

    InventoryTransaction saveTransaction(InventoryTransaction transaction);

    List<InventoryTransaction> getAllTransactions();

    Optional<InventoryTransaction> getTransactionById(Long id);

    List<InventoryTransaction> getTransactionsByEquipment(Long equipmentId);

    List<InventoryTransaction> getTransactionsByChemical(Long chemicalId);

    List<InventoryTransaction> getTransactionsByType(TransactionType type);

    List<InventoryTransaction> getTransactionsByDateRange(
            LocalDate startDate,
            LocalDate endDate
    );

    void deleteTransaction(Long id);
}
