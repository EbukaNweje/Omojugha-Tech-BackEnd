const router = require("express").Router();


const { createCategory, updateCategory, getAllCategories, getCategoryById, deleteCategory } = require("../controllers/categoryController");
const { authenticateAdmin } = require("../middleWare/authentication");


router.post('/create-category',authenticateAdmin, createCategory)
router.put('/update-category', updateCategory)
router.get('/get-category', getAllCategories)
router.get("/get-one-category", getCategoryById)
router.delete("/delete-category", authenticateAdmin, deleteCategory)


module.exports = router