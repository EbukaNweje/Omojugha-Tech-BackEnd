const router = require("express").Router();

const { createProduct, updateProduct, getAllProducts, getProductById, deleteProduct } = require("../controllers/productController");


router.post('/create-product', createProduct)
router.put('/update-product', updateProduct)
router.get('/get-products', getAllProducts)
router.get("/get-one-product", getProductById)
router.delete("/delete-product", deleteProduct)


module.exports = router