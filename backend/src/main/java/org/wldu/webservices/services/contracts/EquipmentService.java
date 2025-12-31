package org.wldu.webservices.services.contracts;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.wldu.webservices.enities.Chemical;
import org.wldu.webservices.enities.Equipment;
import org.wldu.webservices.enities.EquipmentStatus;

import java.util.List;
import java.util.Optional;

public interface EquipmentService {

    Equipment saveEquipment(Equipment equipment);

    List<Equipment> getAllEquipment();

    Optional<Equipment> getEquipmentById(Long id);

    Equipment getEquipmentByName(String name);

    List<Equipment> getEquipmentByStatus(EquipmentStatus status);

    Equipment updateEquipment(Long id, Equipment equipmentDetails);

    // ✅ Add this exact method
    Page<Equipment> getAllEquipment(Pageable pageable);

    void deleteEquipment(Long id);

    long countAll();

    long countLowStock(int threshold);



    List<Equipment> findLowStock(int threshold);
}
