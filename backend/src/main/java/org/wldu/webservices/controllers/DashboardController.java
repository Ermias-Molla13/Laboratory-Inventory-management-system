package org.wldu.webservices.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wldu.webservices.enities.Chemical;
import org.wldu.webservices.enities.Equipment;
import org.wldu.webservices.enities.InventoryTransaction;
import org.wldu.webservices.repositories.InventoryTransactionRepository;
import org.wldu.webservices.services.contracts.ChemicalService;
import org.wldu.webservices.services.contracts.EquipmentService;
import org.wldu.webservices.services.contracts.SupplierService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ChemicalService chemicalService;
    private final EquipmentService equipmentService;
    private final SupplierService supplierService;
    private final InventoryTransactionRepository transactionRepository;

    private static final int LOW_STOCK_THRESHOLD = 10;

    public DashboardController(
            ChemicalService chemicalService,
            EquipmentService equipmentService,
            SupplierService supplierService,
            InventoryTransactionRepository transactionRepository
    ) {
        this.chemicalService = chemicalService;
        this.equipmentService = equipmentService;
        this.supplierService = supplierService;
        this.transactionRepository = transactionRepository;
    }


    @GetMapping("/stats")
    public Map<String, Long> getStats() {
// Here add long can be solve the problem that happened in dashboard not visible the number 
        long totalChemicals = safe(chemicalService.countAll());
        long equipmentItems = safe(equipmentService.countAll());

        long lowChemicals = safe(
                chemicalService.countLowStock(LOW_STOCK_THRESHOLD)
        );
        long lowEquipment = safe(
                equipmentService.countLowStock(LOW_STOCK_THRESHOLD)
        );

        long activeSuppliers = safe(
                supplierService.countActiveSuppliers()
        );

        return Map.of(
                "totalChemicals", totalChemicals,
                "equipmentItems", equipmentItems,
                "lowChemicalStock", lowChemicals,
                "lowEquipmentStock", lowEquipment,
                "activeSuppliers", activeSuppliers
        );
    }


    @GetMapping("/transactions/recent")
    public List<InventoryTransaction> getRecentTransactions() {
        return transactionRepository.findTop5ByOrderByTransactionDateDesc();
    }


    @GetMapping("/chemicals/low-stock")
    public List<Chemical> getLowStockChemicals() {
        return chemicalService.findLowStock(LOW_STOCK_THRESHOLD);
    }

    @GetMapping("/equipment/low-stock")
    public List<Equipment> getLowStockEquipment() {
        return equipmentService.findLowStock(LOW_STOCK_THRESHOLD);
    }

    /* ---------------- Utils ---------------- */

    private long safe(Object value) {
        if (value == null) return 0L;
        if (value instanceof Number number) {
            return number.longValue();
        }
        return 0L;
    }
}
