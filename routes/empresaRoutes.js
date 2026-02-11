// routes/empresa.js
const router = require("express").Router();
const c = require("../controllers/empresaController");
const upload = require("../utils/upload");
// const { authenticateToken, isAdmin } = require("../middlewares/auth"); // si lo usas

router.get("/", c.get);
router.post("/", /*authenticateToken, isAdmin,*/ upload.single("logo"), c.create);
router.put("/",  /*authenticateToken, isAdmin,*/ upload.single("logo"), c.update);

module.exports = router;
