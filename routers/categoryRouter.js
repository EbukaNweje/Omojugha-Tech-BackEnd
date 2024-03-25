const router = require("express").Router();


const { createCategory, updateCategory, getAllCategories, getCategoryById, deleteCategory } = require("../controllers/categoryController");


router.post('/create-category', createCategory)
router.put('/update-category', updateCategory)
router.get('/get-category', getAllCategories)
router.get("/get-one-category", getCategoryById)
router.delete("/delete-category", deleteCategory)


module.exports = router