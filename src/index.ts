import { bootstrapNestApp } from './web/rest/main';

const PORT = process.env.PORT || 5001;

bootstrapNestApp().then(app => app.listen(PORT));
