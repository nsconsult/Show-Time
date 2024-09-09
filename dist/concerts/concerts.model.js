"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcertSchema = void 0;
const mongoose = require("mongoose");
exports.ConcertSchema = new mongoose.Schema({
    name: { type: String, required: true },
    picture: { type: String, required: true },
    date: { type: Date, required: true },
    genre: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
}, {
    timestamps: true,
});
//# sourceMappingURL=concerts.model.js.map