package org.wldu.webservices.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.wldu.webservices.enities.Chemical;
import org.wldu.webservices.enities.Equipment;
import org.wldu.webservices.enities.EquipmentStatus;
import org.wldu.webservices.repositories.EquipmentRepository;
import org.wldu.webservices.services.contracts.EquipmentService;


import org.springframework.data.domain.Pageable; // ✅ CORRECT

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;
    private EquipmentRepository equipmentRepository;


    @PostMapping
    public Equipment addEquipment(@RequestBody Equipment equipment) {
        System.out.println("ADD EQUIPMENT HIT");
        return equipmentService.saveEquipment(equipment);
    }

//    @GetMapping
//    public Page<Equipment> getAllEquipment(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size,
//            @RequestParam(defaultValue = "id") String sortBy
//    ) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
//        return equipmentService.getAllEquipment(pageable);
//    }



    @GetMapping
    public Page<Equipment> getAllEquipment(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return equipmentService.getAllEquipment(pageable);
    }



    @GetMapping("/{id}")
    public Optional<Equipment> getEquipmentById(@PathVariable Long id) {
        return equipmentService.getEquipmentById(id);
    }


    @GetMapping("/name/{name}")
    public Equipment getEquipmentByName(@PathVariable String name) {
        return equipmentService.getEquipmentByName(name);
    }


    @GetMapping("/status/{status}")
    public List<Equipment> getEquipmentByStatus(@PathVariable EquipmentStatus status) {
        return equipmentService.getEquipmentByStatus(status);
    }


//    @GetMapping("/supplier/{supplierId}")
//    public List<Equipment> getEquipmentBySupplier(@PathVariable Long supplierId) {
//        return equipmentService.getEquipmentBySupplier(supplierId);
//    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipment> updateEquipment(
            @PathVariable Long id,
            @RequestBody Equipment equipmentDetails
    ) {
        // CALL THE SERVICE METHOD
        Equipment updatedEquipment = equipmentService.updateEquipment(id, equipmentDetails);

        return ResponseEntity.ok(updatedEquipment);
    }


    @DeleteMapping("/{id}")
    public void deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
    }
}
