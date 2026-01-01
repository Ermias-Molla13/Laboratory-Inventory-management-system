package org.wldu.webservices.services.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wldu.webservices.enities.Chemical;
import org.wldu.webservices.repositories.ChemicalRepository;
import org.wldu.webservices.services.contracts.ChemicalService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ChemicalServiceImpl implements ChemicalService {

    private static final Logger log =
            LoggerFactory.getLogger(ChemicalServiceImpl.class);

    @Autowired
    private ChemicalRepository chemicalRepository;

    /**
     * Save a new chemical or update an existing one.
     */
    @Override
    public Chemical saveChemical(Chemical chemical) {
        log.debug("Saving chemical: {}", chemical.getName());
        return chemicalRepository.save(chemical);
    }

    /**
     * Retrieve all chemicals.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Chemical> getAllChemicals() {
        log.debug("Fetching all chemicals");
        return chemicalRepository.findAll();
    }

    /**
     * Retrieve a chemical by its ID.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Chemical> getChemicalById(Long id) {
        log.debug("Fetching chemical with id={}", id);
        return chemicalRepository.findById(id);
    }

    /**
     * Retrieve a chemical by its name.
     */
    @Override
    @Transactional(readOnly = true)
    public Chemical getChemicalByName(String name) {
        log.debug("Fetching chemical with name={}", name);
        return chemicalRepository.findByName(name);
    }

    /**
     * Retrieve all expired chemicals before a given date.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Chemical> getExpiredChemicals(LocalDate date) {
        log.debug("Fetching expired chemicals before {}", date);
        return chemicalRepository.findByExpiryDateBefore(date);
    }

    /**
     * Retrieve chemicals by storage location.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Chemical> getChemicalsByStorageLocation(String location) {
        log.debug("Fetching chemicals in storage location={}", location);
        return chemicalRepository.findByStorageLocation(location);
    }

    /**
     * Delete a chemical by ID.
     */
    @Override
    public void deleteChemical(Long id) {
        log.warn("Deleting chemical with id={}", id);
        chemicalRepository.deleteById(id);
    }

    /**
     * Update an existing chemical.
     */
    @Override
    public Chemical updateChemical(Long id, Chemical chemical) {
        log.debug("Updating chemical with id={}", id);

        Chemical existing = chemicalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chemical not found"));

        existing.setName(chemical.getName());
        existing.setChemicalFormula(chemical.getChemicalFormula());
        existing.setQuantity(chemical.getQuantity());
        existing.setUnit(chemical.getUnit());
        existing.setExpiryDate(chemical.getExpiryDate());
        existing.setStorageLocation(chemical.getStorageLocation());

        return chemicalRepository.save(existing);
    }

    /**
     * Count all chemicals.
     */
    @Override
    @Transactional(readOnly = true)
    public long countAll() {
        log.debug("Counting all chemicals");
        return chemicalRepository.count();
    }

    @Override
    public long countLowStock(int threshold) {
        return chemicalRepository.findByQuantityLessThan(threshold).size();
    }

    @Override
    public List<Chemical> findLowStock(int threshold) {
        return chemicalRepository.findByQuantityLessThan(threshold);
    }
    @Override
    public List<Chemical> getExpiringSoon(LocalDate now, LocalDate future) {
        return chemicalRepository.findByExpiryDateBetween(now, future);
    }

}
