import express from "express";
import { createProduct, getProducts, updateProduct, deleteProduct, getProductById } from "../controllers/productCntrollers.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createProduct);
router.get("/my", verifyToken, getProducts);
router.get('/:id',verifyToken,getProductById)
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;

