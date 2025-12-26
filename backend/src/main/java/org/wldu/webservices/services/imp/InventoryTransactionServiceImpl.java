package org.wldu.webservices.services.imp;

import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.wldu.webservices.enities.*;
import org.wldu.webservices.repositories.*;
import org.wldu.webservices.services.contracts.InventoryTransactionService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryTransactionServiceImpl implements InventoryTransactionService {

    @Autowired
    private InventoryTransactionRepository transactionRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private ChemicalRepository chemicalRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    public InventoryTransaction saveTransaction(InventoryTransaction transaction) {

        // ✅ Load real entities from DB
        if (transaction.getEquipment() != null && transaction.getEquipment().getId() != null) {
            Equipment eq = equipmentRepository.findById(transaction.getEquipment().getId())
                    .orElseThrow(() -> new RuntimeException("Equipment not found"));
            transaction.setEquipment(eq);
        }

        if (transaction.getChemical() != null && transaction.getChemical().getId() != 0) {
            Chemical chem = chemicalRepository.findById(transaction.getChemical().getId())
                    .orElseThrow(() -> new RuntimeException("Chemical not found"));
            transaction.setChemical(chem);
        }

        if (transaction.getSupplier() != null && transaction.getSupplier().getId() != null) {
            Supplier sup = supplierRepository.findById(transaction.getSupplier().getId())
                    .orElseThrow(() -> new RuntimeException("Supplier not found"));
            transaction.setSupplier(sup);
        }

        // ✅ Defaults are handled by @PrePersist in entity

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
    public List<InventoryTransaction> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByTransactionDateBetween(startDate, endDate);
    }

    @Override
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
