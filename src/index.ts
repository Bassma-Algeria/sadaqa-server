import { bootstrapNestApp } from './web/rest/main';

const PORT = process.env.PORT || 5000;

bootstrapNestApp().then(app => app.listen(PORT));
