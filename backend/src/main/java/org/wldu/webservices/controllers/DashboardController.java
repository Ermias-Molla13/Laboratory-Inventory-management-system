package org.wldu.webservices.controllers;

import jakarta.transaction.Transaction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wldu.webservices.enities.Chemical;
import org.wldu.webservices.enities.InventoryTransaction;
import org.wldu.webservices.repositories.InventoryTransactionRepository;
import org.wldu.webservices.services.contracts.ChemicalService;
import org.wldu.webservices.services.contracts.EquipmentService;
import org.wldu.webservices.services.contracts.SupplierService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ChemicalService chemicalService;
    private final EquipmentService equipmentService;
    private final SupplierService supplierService;
    private final InventoryTransactionRepository transactionRepository;

    // Constructor injection
    public DashboardController(ChemicalService chemicalService,
                               EquipmentService equipmentService,
                               SupplierService supplierService,
                               InventoryTransactionRepository transactionRepository) {
        this.chemicalService = chemicalService;
        this.equipmentService = equipmentService;
        this.supplierService = supplierService;
        this.transactionRepository = transactionRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalChemicals", chemicalService.countAll());
        stats.put("equipmentItems", equipmentService.countAll());
        stats.put("lowStockAlerts", chemicalService.countLowStock());
        stats.put("activeSuppliers", supplierService.countActiveSuppliers());
        return stats;
    }

    @GetMapping("/transactions/recent")
    public List<InventoryTransaction> getRecentTransactions() {
        return transactionRepository.findTop5ByOrderByTransactionDateDesc();
    }


    @GetMapping("/stock/low")
    public List<Chemical> getLowStock() {
        return chemicalService.findLowStock();
    }
}
