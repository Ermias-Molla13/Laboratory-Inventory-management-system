package org.wldu.webservices.services.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.wldu.webservices.enities.InventoryTransaction;
import org.wldu.webservices.enities.TransactionType;
import org.wldu.webservices.repositories.InventoryTransactionRepository;
import org.wldu.webservices.services.contracts.InventoryTransactionService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryTransactionServiceImpl
        implements InventoryTransactionService {

    @Autowired
    private InventoryTransactionRepository transactionRepository;

    @Override
    public InventoryTransaction saveTransaction(
            InventoryTransaction transaction) {
        return transactionRepository.save(transaction);
    }

    @Override
    public List<InventoryTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    public Optional<InventoryTransaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByEquipment(Long equipmentId) {
        return transactionRepository.findByEquipmentId(equipmentId);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByChemical(Long chemicalId) {
        return transactionRepository.findByChemicalId(chemicalId);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByType(TransactionType type) {
        return transactionRepository.findByTransactionType(type);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByDateRange(
            LocalDate startDate,
            LocalDate endDate) {
        return transactionRepository
                .findByTransactionDateBetween(startDate, endDate);
    }

    @Override
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
