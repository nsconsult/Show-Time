import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConcertSchema } from './concerts.model';
import { ConcertController } from './concerts.controller';
import { ConcertService } from './concerts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Concert', schema: ConcertSchema }]),
  ],
  controllers: [ConcertController],
  providers: [ConcertService],
  exports: [ConcertService],
})
export class ConcertsModule {}

// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ConcertSchema } from './concerts.model';
// import { ConcertController } from './concerts.controller';
// import { ConcertService } from './concerts.service';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: 'Concert', schema: ConcertSchema }]),
//   ],
//   controllers: [ConcertController],
//   providers: [ConcertService],
// })
// export class ConcertsModule {}
