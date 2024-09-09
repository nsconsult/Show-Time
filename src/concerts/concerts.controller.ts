import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Render,
  Res,
  HttpException,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConcertService } from './concerts.service';
import { Response } from 'express';
import * as path from 'path';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('concerts')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {
    // Crée le répertoire 'uploads' si nécessaire
    const uploadsDir = path.join(__dirname, '..', '..', 'public/concert');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true }); // Assure que tous les sous-répertoires sont créés
    }
  }

  @Get('/create')
  @Render('concerts/create')
  createConcertForm() {
    return {};
  }

  @Get()
  @Render('concerts/index')
  async getAllConcerts() {
    const concerts = await this.concertService.findAll();
    return { concerts };
  }

  @Get(':id')
  @Render('concerts/show')
  async getConcertById(@Param('id') id: string, @Res() res: Response) {
    try {
      const concert = await this.concertService.findById(id);
      console.log('Concert:', concert); // Ajoutez cette ligne pour voir ce qui est renvoyé
      if (!concert) {
        throw new HttpException('Concert not found', HttpStatus.NOT_FOUND);
      }
      return { concert };
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Failed to retrieve concert', error: error.message });
    }
  }

  @Post('/create')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: path.join(__dirname, '..', 'uploads'), // Utilisation du chemin absolu
        filename: (req, file, callback) => {
          const filename = Date.now() + path.extname(file.originalname);
          callback(null, filename);
        },
      }),
    }),
  )
  async createConcert(
    @Body('name') name: string,
    @Body('date') date: Date,
    @Body('location') location: string,
    @Body('genre') genre: string,
    @Body('description') description: string,
    @Body('price') price: number,
    @UploadedFile() picture: Express.Multer.File, // Correction du type pour le fichier téléchargé
    @Res() res: Response,
  ) {
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
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Failed to create concert', error: error.message });
    }
  }

  @Get('/edit/:id')
  @Render('concerts/edit')
  async editConcertForm(@Param('id') id: string, @Res() res: Response) {
    try {
      const concert = await this.concertService.findById(id);
      if (!concert) {
        throw new HttpException('Concert not found', HttpStatus.NOT_FOUND);
      }
      return { concert };
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Failed to retrieve concert for editing',
        error: error.message,
      });
    }
  }

  @Put('/edit/:id')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: path.join(__dirname, '..', 'uploads'), // Utilisation du chemin absolu
        filename: (req, file, callback) => {
          const filename = Date.now() + path.extname(file.originalname);
          callback(null, filename);
        },
      }),
    }),
  )
  async updateConcert(
    @Param('id') id: string,
    @Body() updateConcertDto: any,
    @UploadedFile() picture: Express.Multer.File, // Correction du type pour le fichier téléchargé
    @Res() res: Response,
  ) {
    try {
      const updatedConcert = {
        ...updateConcertDto,
        picture: picture ? picture.filename : updateConcertDto.picture,
      };
      await this.concertService.update(id, updatedConcert);
      res.redirect(`/concerts/${id}`);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Failed to update concert', error: error.message });
    }
  }

  @Delete(':id')
  async deleteConcert(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.concertService.remove(id);
      res.redirect('/concerts');
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Failed to delete concert', error: error.message });
    }
  }
}

// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Param,
//   Body,
//   Render,
//   Res,
// } from '@nestjs/common';
// import { ConcertService } from './concerts.service';
// import { Response } from 'express';

// @Controller('concerts')
// export class ConcertController {
//   constructor(private readonly concertService: ConcertService) {}

//   @Get()
//   @Render('concerts/index')
//   async getAllConcerts() {
//     const concerts = await this.concertService.findAll();
//     return { concerts };
//   }

//   @Get(':id')
//   @Render('concerts/show')
//   async getConcertById(@Param('id') id: string) {
//     const concert = await this.concertService.findById(id);
//     return { concert };
//   }

//   @Get('/create')
//   @Render('concerts/create')
//   createConcertForm() {
//     return {};
//   }

//   @Post('/create')
//   async createConcert(@Body() createConcertDto: any, @Res() res: Response) {
//     await this.concertService.create(createConcertDto);
//     res.redirect('/concerts');
//   }

//   @Get('/edit/:id')
//   @Render('concerts/edit')
//   async editConcertForm(@Param('id') id: string) {
//     const concert = await this.concertService.findById(id);
//     return { concert };
//   }

//   @Put('/edit/:id')
//   async updateConcert(
//     @Param('id') id: string,
//     @Body() updateConcertDto: any,
//     @Res() res: Response,
//   ) {
//     await this.concertService.update(id, updateConcertDto);
//     res.redirect(`/concerts/${id}`);
//   }

//   @Delete(':id')
//   async deleteConcert(@Param('id') id: string, @Res() res: Response) {
//     await this.concertService.remove(id);
//     res.redirect('/concerts');
//   }
// }
