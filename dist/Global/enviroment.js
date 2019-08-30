"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_PORT = Number(process.env.SERVER_PORT) || 9500;
exports.HOST = process.env.SERVER_PORT || "http://localhost:4200";
exports.URI_MONGO = process.env.URI_MONGO || 'mongodb+srv://intermediario:1234@cluster0-aobp0.mongodb.net/test2';
exports.PREFIJO = process.env.PREFIJO || 'P-M';
exports.SUFIJO = process.env.SUFIJO || 'BITERLAB';
exports.URL_SERVIDOR_IMAGES = process.env.URL_SERVIDOR_IMAGES || 'https://dev.pilotpro.info';
exports.URL_BACKEND = "http://localhost:5100";
