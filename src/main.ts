import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as passport from 'passport';
import * as session from 'express-session';
import * as flash from 'express-flash';
import * as methodOverride from 'method-override'; // Import de method-override
async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public/images'), {
    prefix: '/images/',
  });
  app.setViewEngine('ejs');
  app.use(
    session({
      secret: 'votre_secret', // Changez ceci par un secret fort
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Utilisez 'true' si vous utilisez HTTPS
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Utiliser method-override pour permettre les requêtes PUT et DELETE via les formulaires
  app.use(methodOverride('_method'));

  // Démarrer l'application
  app.use(flash());
  await app.listen(3000);
}
bootstrap();
