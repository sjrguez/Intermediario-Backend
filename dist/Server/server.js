"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enviroment_1 = require("../Global/enviroment");
class Server {
    constructor() {
        this.App = express_1.default();
        this.Port = enviroment_1.SERVER_PORT;
    }
    constantes() {
        return {
            App: this.App,
            Port: this.Port
        };
    }
    start(callback) {
        this.App.listen(this.Port, callback());
    }
}
exports.default = Server;
