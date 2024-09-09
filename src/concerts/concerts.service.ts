import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Concert } from './concerts.model';

@Injectable()
export class ConcertService {
  constructor(
    @InjectModel('Concert') private readonly concertModel: Model<Concert>,
  ) {}

  async createConcert(createConcertDto: any): Promise<Concert> {
    const newConcert = new this.concertModel(createConcertDto);
    return newConcert.save();
  }

  async findAll(): Promise<Concert[]> {
    return this.concertModel.find().exec();
  }

  async findById(id: string): Promise<Concert> {
    return this.concertModel.findById(id).exec();
  }

  async update(id: string, updateConcertDto: any): Promise<Concert> {
    return this.concertModel
      .findByIdAndUpdate(id, updateConcertDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Concert> {
    return this.concertModel.findByIdAndDelete(id).exec();
  }
}

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Concert, ConcertDocument } from './concerts.model';

// @Injectable()
// export class ConcertService {
//   constructor(
//     @InjectModel('Concert') private concertModel: Model<ConcertDocument>,
//   ) {}

//   async findAll(): Promise<Concert[]> {
//     return this.concertModel.find().exec();
//   }

//   async findById(id: string): Promise<Concert> {
//     return this.concertModel.findById(id).exec();
//   }

//   async createConcert(createConcertDto: any): Promise<Concert> {
//     const newConcert = new this.concertModel(createConcertDto);
//     return newConcert.save();
//   }

//   async update(id: string, updateConcertDto: any): Promise<Concert> {
//     return this.concertModel
//       .findByIdAndUpdate(id, updateConcertDto, { new: true })
//       .exec();
//   }

//   async remove(id: string): Promise<any> {
//     return this.concertModel.findByIdAndDelete(id).exec();
//   }
// }
