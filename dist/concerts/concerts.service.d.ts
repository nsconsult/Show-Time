import { Model } from 'mongoose';
import { Concert } from './concerts.model';
export declare class ConcertService {
    private readonly concertModel;
    constructor(concertModel: Model<Concert>);
    createConcert(createConcertDto: any): Promise<Concert>;
    findAll(): Promise<Concert[]>;
    findById(id: string): Promise<Concert>;
    update(id: string, updateConcertDto: any): Promise<Concert>;
    remove(id: string): Promise<Concert>;
}
