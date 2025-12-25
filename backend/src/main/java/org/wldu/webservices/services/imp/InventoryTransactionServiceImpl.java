package org.wldu.webservices.services.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.wldu.webservices.enities.InventoryTransaction;
import org.wldu.webservices.repositories.InventoryTransactionRepository;
import org.wldu.webservices.services.contracts.InventoryTransactionService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryTransactionServiceImpl
        implements InventoryTransactionService {

    @Autowired
    private InventoryTransactionRepository transactionRepository;

    @Override
    public InventoryTransaction saveTransaction(InventoryTransaction transaction) {
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
        return transactionRepository.findByEquipment_Id(equipmentId);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByChemical(Long chemicalId) {
        return transactionRepository.findByChemical_Id(chemicalId);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByType(String transactionType) {
        return transactionRepository.findByTransactionType(transactionType);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByDateRange(
            LocalDateTime startDate,
            LocalDateTime endDate) {
        return transactionRepository
                .findByTransactionDateBetween(startDate, endDate);
    }

    @Override
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
