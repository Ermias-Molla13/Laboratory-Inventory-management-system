package org.wldu.webservices.services.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.wldu.webservices.enities.Chemical;
import org.wldu.webservices.enities.Supplier;
import org.wldu.webservices.repositories.SupplierRepository;
import org.wldu.webservices.services.contracts.SupplierService;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    public Supplier saveSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    @Override
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @Override
    public Optional<Supplier> getSupplierById(Long id) {
        return supplierRepository.findById(id);
    }

    @Override
    public Supplier getSupplierByName(String name) {
        return supplierRepository.findByName(name);
    }

    @Override
    public Supplier getSupplierByEmail(String email) {
        return supplierRepository.findByEmail(email);
    }

    @Override
    public List<Supplier> getSuppliersByContactPerson(String contactPerson) {
        return supplierRepository.findByContactPerson(contactPerson);
    }

    @Override
    public Chemical updateChemical(Long id, Chemical chemical) {
        return null;
    }

    @Override
    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }

    @Override
    public Supplier update(Long id, Supplier supplier) {

        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));

        // Update fields
        existingSupplier.setName(supplier.getName());
        existingSupplier.setContactPerson(supplier.getContactPerson());
        existingSupplier.setEmail(supplier.getEmail());
        existingSupplier.setPhoneNumber(supplier.getPhoneNumber());
        existingSupplier.setAddress(supplier.getAddress());
//        existingSupplier.setAddress(supplier.getCatagory());

        return supplierRepository.save(existingSupplier);
    }

    @Override
    public Object countActiveSuppliers() {
        return null;
    }
}
