const router = require("express").Router();

const { createProduct, updateProduct, getAllProducts, getProductById, deleteProduct } = require("../controllers/productController");
const { authenticateAdmin } = require("../middleWare/authentication");
const upload = require('../utils/multer')


router.post('/products/:categoryId', upload.array('images', 5), authenticateAdmin, createProduct);
router.put('/products/:id', upload.array('images', 5), authenticateAdmin, updateProduct);
router.get('/get-products', getAllProducts)
router.get("/get-one-product", getProductById)
router.delete("/delete-product", authenticateAdmin, deleteProduct)


module.exports = router