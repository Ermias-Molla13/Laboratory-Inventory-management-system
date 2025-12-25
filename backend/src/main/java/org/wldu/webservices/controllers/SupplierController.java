package org.wldu.webservices.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.wldu.webservices.enities.Supplier;
import org.wldu.webservices.services.contracts.SupplierService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;


    @PostMapping
    public Supplier addSupplier(@RequestBody Supplier supplier) {
        return supplierService.saveSupplier(supplier);
    }


    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }


    @GetMapping("/{id}")
    public Optional<Supplier> getSupplierById(@PathVariable Long id) {
        return supplierService.getSupplierById(id);
    }


    @GetMapping("/name/{name}")
    public Supplier getSupplierByName(@PathVariable String name) {
        return supplierService.getSupplierByName(name);
    }


    @GetMapping("/email/{email}")
    public Supplier getSupplierByEmail(@PathVariable String email) {
        return supplierService.getSupplierByEmail(email);
    }


    @GetMapping("/contact/{contactPerson}")
    public List<Supplier> getByContactPerson(
            @PathVariable String contactPerson) {
        return supplierService.getSuppliersByContactPerson(contactPerson);
    }
    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable Long id,
                                   @RequestBody Supplier supplier) {
        return supplierService.update(id, supplier);

    }
    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
    }
}
