package org.wldu.webservices.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.wldu.webservices.enities.Equipment;
import org.wldu.webservices.enities.EquipmentStatus;
import org.wldu.webservices.services.contracts.EquipmentService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;


    @PostMapping
    public Equipment addEquipment(@RequestBody Equipment equipment) {
        return equipmentService.saveEquipment(equipment);
    }


    @GetMapping
    public List<Equipment> getAllEquipment() {
        return equipmentService.getAllEquipment();
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
    public ResponseEntity<String> test(@PathVariable Long id) {
        return ResponseEntity.ok("PUT WORKS");
    }


    @DeleteMapping("/{id}")
    public void deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
    }
}
