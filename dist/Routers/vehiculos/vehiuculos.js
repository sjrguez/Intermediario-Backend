"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ROUTER = express_1.Router();
ROUTER.get('/prueba', (req, res) => {
    res.json({ ok: false });
});
module.exports = ROUTER;
