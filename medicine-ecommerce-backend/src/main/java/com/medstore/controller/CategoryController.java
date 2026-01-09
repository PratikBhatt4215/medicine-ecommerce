package com.medstore.controller;

import com.medstore.constants.ResponseCodes;
import com.medstore.dto.ApiResponse;
import com.medstore.model.Category;
import com.medstore.service.CategoryService;
import com.medstore.service.MessageResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {
    
    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private MessageResolver messageResolver;

    private String getMessage(String code) {
        return messageResolver.getMessage(code);
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        logger.info("Fetching all categories");
        List<Category> categories = categoryService.getAllCategories();
        logger.info("Fetched {} categories", categories.size());
        return ResponseEntity.ok(ApiResponse.success(categories, getMessage(ResponseCodes.CATEGORIES_RETRIEVED)));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable Long id) {
        logger.info("Fetching category with ID: {}", id);
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success(category, getMessage(ResponseCodes.CATEGORY_RETRIEVED)));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody Category category) {
        logger.info("Creating new category: {}", category.getName());
        Category created = categoryService.createCategory(category);
        logger.info("Category created with ID: {}", created.getId());
        return ResponseEntity.ok(ApiResponse.success(created, getMessage(ResponseCodes.CATEGORY_CREATED)));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        logger.info("Updating category ID: {}", id);
        Category updated = categoryService.updateCategory(id, category);
        logger.info("Category updated successfully");
        return ResponseEntity.ok(ApiResponse.success(updated, getMessage(ResponseCodes.CATEGORY_UPDATED)));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        logger.info("Deleting category ID: {}", id);
        categoryService.deleteCategory(id);
        logger.info("Category deleted successfully");
        return ResponseEntity.ok(ApiResponse.success(null, getMessage(ResponseCodes.CATEGORY_DELETED)));
    }
}
