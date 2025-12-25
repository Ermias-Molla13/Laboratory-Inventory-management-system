package org.wldu.webservices.enities;

import jakarta.persistence.*;
import jakarta.transaction.Transaction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction {
  @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    @ManyToOne
    @JoinColumn(name = "chemical_id")
    private Chemical chemical;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(nullable = false)
    private double quantity;  // Amount added or removed

    @Column(nullable = false)
    private String transactionType; // "IN" or "OUT"

    @Column(nullable = false)
    private LocalDateTime transactionDate;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    @Column
    private String notes;

    /* ===================== */
    /* Constructors */
    /* ===================== */

    public InventoryTransaction() {}  // Default constructor

    public InventoryTransaction(Equipment equipment, Chemical chemical, Supplier supplier,
                                double quantity, String transactionType,
                                LocalDateTime transactionDate, String notes) {
        this.equipment = equipment;
        this.chemical = chemical;
        this.supplier = supplier;
        this.quantity = quantity;
        this.transactionType = transactionType;
        this.transactionDate = transactionDate;
        this.notes = notes;
    }

    public static List<Transaction> findRecent(int i) {
        return new ArrayList<>(); // returns an empty list for now
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }

    public Chemical getChemical() {
        return chemical;
    }

    public void setChemical(Chemical chemical) {
        this.chemical = chemical;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
