import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { UsersController } from './users/users.controller';
import { ConcertsModule } from './concerts/concerts.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Admin:Tetefelix0*@lix.aejbx.mongodb.net/show_time?retryWrites=true&appName=lix',
    ),
    UsersModule,
    AuthModule,
    ConcertsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
