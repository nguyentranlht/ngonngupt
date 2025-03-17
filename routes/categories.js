const express = require('express');
const router = express.Router();
const Category = require('../schemas/category');

// GET tất cả categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// GET category theo ID
router.get('/:id', async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
});

// POST tạo category mới
router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    // Kiểm tra xem category đã tồn tại chưa
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Danh mục này đã tồn tại' });
    }
    
    const newCategory = new Category({
      name,
      description
    });
    
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    next(error);
  }
});

// PUT cập nhật category
router.put('/:id', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    // Kiểm tra xem tên mới đã tồn tại chưa (nếu tên bị thay đổi)
    if (name) {
      const existingCategory = await Category.findOne({ 
        name, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingCategory) {
        return res.status(400).json({ message: 'Tên danh mục này đã tồn tại' });
      }
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
});

// DELETE xóa category
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    
    res.json({ message: 'Đã xóa danh mục thành công' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 