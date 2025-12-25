package org.wldu.webservices.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.wldu.webservices.enities.InventoryTransaction;
import org.wldu.webservices.enities.TransactionType;
import org.wldu.webservices.services.contracts.InventoryTransactionService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
public class InventoryTransactionController {

    @Autowired
    private InventoryTransactionService transactionService;


    @PostMapping
    public InventoryTransaction addTransaction(
            @RequestBody InventoryTransaction transaction) {
        return transactionService.saveTransaction(transaction);
    }


    @GetMapping
    public List<InventoryTransaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }


    @GetMapping("/{id}")
    public Optional<InventoryTransaction> getTransactionById(
            @PathVariable Long id) {
        return transactionService.getTransactionById(id);
    }


    @GetMapping("/equipment/{equipmentId}")
    public List<InventoryTransaction> getByEquipment(
            @PathVariable Long equipmentId) {
        return transactionService.getTransactionsByEquipment(equipmentId);
    }


    @GetMapping("/chemical/{chemicalId}")
    public List<InventoryTransaction> getByChemical(
            @PathVariable Long chemicalId) {
        return transactionService.getTransactionsByChemical(chemicalId);
    }


    @GetMapping("/type/{type}")
    public List<InventoryTransaction> getByType(
            @PathVariable TransactionType type) {
        return transactionService.getTransactionsByType(type);
    }


    @GetMapping("/date")
    public List<InventoryTransaction> getByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        return transactionService
                .getTransactionsByDateRange(startDate, endDate);
    }


    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
    }
}
