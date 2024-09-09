"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const methodOverride = require("method-override");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public/images'), {
        prefix: '/images/',
    });
    app.setViewEngine('ejs');
    app.use(session({
        secret: 'votre_secret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(methodOverride('_method'));
    app.use(flash());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map