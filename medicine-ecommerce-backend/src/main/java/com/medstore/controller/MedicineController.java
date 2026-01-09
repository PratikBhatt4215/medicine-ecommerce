package com.medstore.controller;

import com.medstore.constants.ResponseCodes;
import com.medstore.dto.ApiResponse;
import com.medstore.model.Medicine;
import com.medstore.service.MedicineService;
import com.medstore.service.MessageResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*")
public class MedicineController {
    
    private static final Logger logger = LoggerFactory.getLogger(MedicineController.class);

    @Autowired
    private MedicineService medicineService;

    @Autowired
    private MessageResolver messageResolver;

    private String getMessage(String code) {
        return messageResolver.getMessage(code);
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Medicine>>> getAllMedicines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        logger.info("Fetching all medicines. Page: {}, Size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Medicine> medicines = medicineService.getAllMedicines(pageable);
        logger.info("Fetched {} medicines", medicines.getNumberOfElements());
        return ResponseEntity.ok(ApiResponse.success(medicines, getMessage(ResponseCodes.MEDICINES_RETRIEVED)));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Medicine>> getMedicineById(@PathVariable Long id) {
        logger.info("Fetching medicine with ID: {}", id);
        Medicine medicine = medicineService.getMedicineById(id);
        logger.info("Fetched medicine: {}", medicine.getName());
        return ResponseEntity.ok(ApiResponse.success(medicine, getMessage(ResponseCodes.MEDICINE_RETRIEVED)));
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<Medicine>>> getMedicinesByCategory(@PathVariable Long categoryId) {
        logger.info("Fetching medicines for category ID: {}", categoryId);
        List<Medicine> medicines = medicineService.getMedicinesByCategory(categoryId);
        logger.info("Fetched {} medicines for category", medicines.size());
        return ResponseEntity.ok(ApiResponse.success(medicines, getMessage(ResponseCodes.MEDICINES_RETRIEVED)));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<Medicine>>> searchMedicines(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        logger.info("Searching medicines with keyword: '{}'", keyword);
        Pageable pageable = PageRequest.of(page, size);
        Page<Medicine> results = medicineService.searchMedicines(keyword, pageable);
        logger.info("Found {} results", results.getNumberOfElements());
        return ResponseEntity.ok(ApiResponse.success(results, getMessage(ResponseCodes.MEDICINES_RETRIEVED)));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Medicine>> createMedicine(@RequestBody Medicine medicine) {
        logger.info("Creating new medicine: {}", medicine.getName());
        Medicine created = medicineService.createMedicine(medicine);
        logger.info("Medicine created with ID: {}", created.getId());
        return ResponseEntity.ok(ApiResponse.success(created, getMessage(ResponseCodes.MEDICINE_CREATED)));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Medicine>> updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
        logger.info("Updating medicine ID: {}", id);
        Medicine updated = medicineService.updateMedicine(id, medicine);
        logger.info("Medicine updated successfully");
        return ResponseEntity.ok(ApiResponse.success(updated, getMessage(ResponseCodes.MEDICINE_UPDATED)));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMedicine(@PathVariable Long id) {
        logger.info("Deleting medicine ID: {}", id);
        medicineService.deleteMedicine(id);
        logger.info("Medicine deleted successfully");
        return ResponseEntity.ok(ApiResponse.success(null, getMessage(ResponseCodes.MEDICINE_DELETED)));
    }
}
