package org.wldu.webservices.enities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @ManyToOne
    @JoinColumn(name = "chemical_id", nullable = false)
    private Chemical chemical;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Column(nullable = false)
    private double quantity;

    // ✅ Correct enum mapping
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType; // IN / OUT

    @Column(nullable = false)
    private LocalDateTime transactionDate;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column
    private String notes;

    /* ===================== */
    /* Constructors */
    /* ===================== */

    public InventoryTransaction() {
    }

    // ✅ Correct constructor
    public InventoryTransaction(
            Equipment equipment,
            Chemical chemical,
            Supplier supplier,
            double quantity,
            TransactionType transactionType,
            LocalDateTime transactionDate,
            LocalDateTime timestamp,
            String notes
    ) {
        this.equipment = equipment;
        this.chemical = chemical;
        this.supplier = supplier;
        this.quantity = quantity;
        this.transactionType = transactionType;
        this.transactionDate = transactionDate;
        this.timestamp = timestamp;
        this.notes = notes;
    }
}
