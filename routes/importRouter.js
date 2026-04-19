import express from "express";
import multer from "multer";
import path from "path";
import { ensureLoggedIn } from "../middleware/auth";
import {
  getTemplates,
  getUserMappings,
  saveMapping,
  deleteMapping,
  previewImport,
  confirmImport,
} from "../services/importService";

const importRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

// GET /api/import/templates — built-in broker templates
importRouter.get("/templates", async (_req, res, next) => {
  try {
    res.json(await getTemplates());
  } catch (e) { next(e); }
});

// GET /api/import/mappings — user's saved mappings
importRouter.get("/mappings", ensureLoggedIn, async (req, res, next) => {
  try {
    res.json(await getUserMappings(req.user._id || req.user.id));
  } catch (e) { next(e); }
});

// POST /api/import/mappings — save a mapping
importRouter.post("/mappings", ensureLoggedIn, async (req, res, next) => {
  try {
    const mapping = await saveMapping({ ...req.body, userId: req.user._id || req.user.id });
    res.status(201).json(mapping);
  } catch (e) { next(e); }
});

// DELETE /api/import/mappings/:id — delete a saved mapping
importRouter.delete("/mappings/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    await deleteMapping(req.params.id, req.user._id || req.user.id);
    res.json({ deleted: true });
  } catch (e) { next(e); }
});

// POST /api/import/preview — upload CSV, get mapping suggestions and row preview
importRouter.post("/preview", ensureLoggedIn, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const { columnMap, tranCodeMap, portfolioId } = req.body;
    const result = await previewImport({
      filePath: req.file.path,
      filename: req.file.originalname,
      columnMap: columnMap ? JSON.parse(columnMap) : null,
      tranCodeMap: tranCodeMap ? JSON.parse(tranCodeMap) : null,
      portfolioId,
      userId: req.user._id || req.user.id,
    });
    res.json(result);
  } catch (e) { next(e); }
});

// POST /api/import/confirm — execute the import after user confirms
importRouter.post("/confirm", ensureLoggedIn, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const { columnMap, tranCodeMap, portfolioId, mappingId } = req.body;
    if (!portfolioId) return res.status(400).json({ error: "portfolioId is required" });

    const result = await confirmImport({
      filePath: req.file.path,
      filename: req.file.originalname,
      columnMap: JSON.parse(columnMap || "{}"),
      tranCodeMap: tranCodeMap ? JSON.parse(tranCodeMap) : null,
      portfolioId,
      userId: req.user._id || req.user.id,
      mappingId,
    });
    res.json(result);
  } catch (e) { next(e); }
});

export default importRouter;
