import { bootstrapNestApp } from './web/nestjs/main';

const PORT = process.env.PORT || 5000;

bootstrapNestApp().then(app => app.listen(PORT));
