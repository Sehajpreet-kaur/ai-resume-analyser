import express from "express";
import { protect } from "../../controllers/AuthMiddleware.js";
import { getKey, setKey, deleteKey, listKeys, flushKeys } from "../../controllers/kvController.js";

const router = express.Router();

router.use(protect);

router.get("/",        listKeys);
router.delete("/",     flushKeys);
router.get("/:key",    getKey);
router.put("/:key",    setKey);
router.delete("/:key", deleteKey);

export default router;