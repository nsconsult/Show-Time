"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcertController = void 0;
const common_1 = require("@nestjs/common");
const concerts_service_1 = require("./concerts.service");
const path = require("path");
const multer_1 = require("multer");
const fs = require("fs");
const platform_express_1 = require("@nestjs/platform-express");
let ConcertController = class ConcertController {
    constructor(concertService) {
        this.concertService = concertService;
        const uploadsDir = path.join(__dirname, '..', '..', 'public/concert');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
    }
    createConcertForm() {
        return {};
    }
    async getAllConcerts() {
        const concerts = await this.concertService.findAll();
        return { concerts };
    }
    async getConcertById(id, res) {
        try {
            const concert = await this.concertService.findById(id);
            console.log('Concert:', concert);
            if (!concert) {
                throw new common_1.HttpException('Concert not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { concert };
        }
        catch (error) {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .send({ message: 'Failed to retrieve concert', error: error.message });
        }
    }
    async createConcert(name, date, location, genre, description, price, picture, res) {
        try {
            const picturePath = picture ? picture.filename : null;
            const newConcert = await this.concertService.createConcert({
                name,
                date,
                picture: picturePath,
                genre,
                location,
                description,
                price,
            });
            res.redirect(`/concerts/${newConcert._id}`);
        }
        catch (error) {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .send({ message: 'Failed to create concert', error: error.message });
        }
    }
    async editConcertForm(id, res) {
        try {
            const concert = await this.concertService.findById(id);
            if (!concert) {
                throw new common_1.HttpException('Concert not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { concert };
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).send({
                message: 'Failed to retrieve concert for editing',
                error: error.message,
            });
        }
    }
    async updateConcert(id, updateConcertDto, picture, res) {
        try {
            const updatedConcert = {
                ...updateConcertDto,
                picture: picture ? picture.filename : updateConcertDto.picture,
            };
            await this.concertService.update(id, updatedConcert);
            res.redirect(`/concerts/${id}`);
        }
        catch (error) {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .send({ message: 'Failed to update concert', error: error.message });
        }
    }
    async deleteConcert(id, res) {
        try {
            await this.concertService.remove(id);
            res.redirect('/concerts');
        }
        catch (error) {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .send({ message: 'Failed to delete concert', error: error.message });
        }
    }
};
exports.ConcertController = ConcertController;
__decorate([
    (0, common_1.Get)('/create'),
    (0, common_1.Render)('concerts/create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConcertController.prototype, "createConcertForm", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)('concerts/index'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConcertController.prototype, "getAllConcerts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.Render)('concerts/show'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConcertController.prototype, "getConcertById", null);
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('picture', {
        storage: (0, multer_1.diskStorage)({
            destination: path.join(__dirname, '..', 'uploads'),
            filename: (req, file, callback) => {
                const filename = Date.now() + path.extname(file.originalname);
                callback(null, filename);
            },
        }),
    })),
    __param(0, (0, common_1.Body)('name')),
    __param(1, (0, common_1.Body)('date')),
    __param(2, (0, common_1.Body)('location')),
    __param(3, (0, common_1.Body)('genre')),
    __param(4, (0, common_1.Body)('description')),
    __param(5, (0, common_1.Body)('price')),
    __param(6, (0, common_1.UploadedFile)()),
    __param(7, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date, String, String, String, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ConcertController.prototype, "createConcert", null);
__decorate([
    (0, common_1.Get)('/edit/:id'),
    (0, common_1.Render)('concerts/edit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConcertController.prototype, "editConcertForm", null);
__decorate([
    (0, common_1.Put)('/edit/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('picture', {
        storage: (0, multer_1.diskStorage)({
            destination: path.join(__dirname, '..', 'uploads'),
            filename: (req, file, callback) => {
                const filename = Date.now() + path.extname(file.originalname);
                callback(null, filename);
            },
        }),
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ConcertController.prototype, "updateConcert", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConcertController.prototype, "deleteConcert", null);
exports.ConcertController = ConcertController = __decorate([
    (0, common_1.Controller)('concerts'),
    __metadata("design:paramtypes", [concerts_service_1.ConcertService])
], ConcertController);
//# sourceMappingURL=concerts.controller.js.map