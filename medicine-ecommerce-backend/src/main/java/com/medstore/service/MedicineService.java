package com.medstore.service;

import com.medstore.constants.ResponseCodes;
import com.medstore.exception.ResourceNotFoundException;
import com.medstore.model.Medicine;
import com.medstore.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineService {
    
    @Autowired
    private MedicineRepository medicineRepository;
    
    @Autowired
    private CategoryService categoryService;
    
    public Page<Medicine> getAllMedicines(Pageable pageable) {
        return medicineRepository.findAll(pageable);
    }
    
    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ResponseCodes.MEDICINE_NOT_FOUND, id));
    }
    
    public List<Medicine> getMedicinesByCategory(Long categoryId) {
        return medicineRepository.findByCategoryId(categoryId);
    }
    
    public Page<Medicine> searchMedicines(String keyword, Pageable pageable) {
        return medicineRepository.searchMedicines(keyword, pageable);
    }
    
    public Medicine createMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }
    
    public Medicine updateMedicine(Long id, Medicine medicineDetails) {
        Medicine medicine = getMedicineById(id);
        medicine.setName(medicineDetails.getName());
        medicine.setDescription(medicineDetails.getDescription());
        medicine.setPrice(medicineDetails.getPrice());
        medicine.setImageUrl(medicineDetails.getImageUrl());
        medicine.setStock(medicineDetails.getStock());
        medicine.setCategory(medicineDetails.getCategory());
        return medicineRepository.save(medicine);
    }
    
    public void deleteMedicine(Long id) {
        Medicine medicine = getMedicineById(id);
        medicineRepository.delete(medicine);
    }
}
