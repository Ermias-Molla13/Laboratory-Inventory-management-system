package org.wldu.webservices.controllers;

import org.springframework.web.bind.annotation.*;
import org.wldu.webservices.enities.InventoryTransaction;
import org.wldu.webservices.services.contracts.InventoryTransactionService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryTransactionController {

    private final InventoryTransactionService transactionService;

    public InventoryTransactionController(
            InventoryTransactionService transactionService
    ) {
        this.transactionService = transactionService;
    }

    // ✅ Create transaction
    @PostMapping
    public InventoryTransaction addTransaction(
            @RequestBody InventoryTransaction transaction) {
        return transactionService.saveTransaction(transaction);
    }



    // ✅ Get all transactions
    @GetMapping
    public List<InventoryTransaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    // ✅ Get by ID
    @GetMapping("/{id}")
    public Optional<InventoryTransaction> getTransactionById(
            @PathVariable Long id) {
        return transactionService.getTransactionById(id);
    }

    // ✅ Get by Equipment
    @GetMapping("/equipment/{equipmentId}")
    public List<InventoryTransaction> getByEquipment(
            @PathVariable Long equipmentId) {
        return transactionService.getTransactionsByEquipment(equipmentId);
    }

    // ✅ Get by Chemical
    @GetMapping("/chemical/{chemicalId}")
    public List<InventoryTransaction> getByChemical(
            @PathVariable Long chemicalId) {
        return transactionService.getTransactionsByChemical(chemicalId);
    }

    // ✅ FIX: Enum instead of TransactionType
    @GetMapping("/type/{type}")
    public List<InventoryTransaction> getByType(
            @PathVariable String type) {
        return transactionService.getTransactionsByType(type);
    }

    // ✅ FIX: LocalDateTime instead of LocalDate
//    @GetMapping("/date")
//    public List<InventoryTransaction> getByDateRange(
//            @RequestParam LocalDateTime startDate,
//            @RequestParam LocalDateTime endDate) {
//        return transactionService.getTransactionsByDateRange(
//                startDate, endDate
//        );
//    }

    // ✅ Delete
    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
    }
}
