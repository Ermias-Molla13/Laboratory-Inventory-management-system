package org.wldu.webservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wldu.webservices.enities.InventoryTransaction;
import org.wldu.webservices.enities.TransactionType;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    
    List<InventoryTransaction> findByEquipment_Id(Long equipmentId);

    
    List<InventoryTransaction> findByChemical_Id(Long chemicalId);

    
    List<InventoryTransaction> findTop5ByOrderByTransactionDateDesc();

    
    List<InventoryTransaction> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);

    
    List<InventoryTransaction> findByTransactionType(TransactionType transactionType);
}
