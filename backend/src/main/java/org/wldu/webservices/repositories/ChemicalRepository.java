package org.wldu.webservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wldu.webservices.enities.Chemical;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for {@link Chemical} entity.
 *
 * Provides CRUD operations and custom query methods
 * for managing laboratory chemicals.
 */
@Repository
public interface ChemicalRepository extends JpaRepository<Chemical, Long> {

    /**
     * Find a chemical by its unique name.
     *
     * @param name chemical name
     * @return Chemical entity or null if not found
     */
    Chemical findByName(String name);

    /**
     * Find all chemicals that expired before the given date.
     *
     * @param date cutoff expiry date
     * @return list of expired chemicals
     */
    List<Chemical> findByExpiryDateBefore(LocalDate date);

    /**
     * Find chemicals stored in a specific storage location.
     *
     * @param storageLocation storage location name
     * @return list of chemicals in the given location
     */
    List<Chemical> findByStorageLocation(String storageLocation);

    /**
     * Find chemicals with quantity below a given threshold.
     * Used for identifying low-stock chemicals.
     *
     * @param threshold quantity limit
     * @return list of low-stock chemicals
     */
    List<Chemical> findByQuantityLessThan(int threshold);
}
