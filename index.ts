import express from 'express';
import { mongoConnect } from './src/db/';
import { customErrorRes } from './src/services/response';
import routes from './src/routes';
import cors from 'cors';
import { config } from './src/services/config';
import { webhook } from './src/controllers/order';

const app = express();
const hook = express();
const port = config.port;
const webhookPort = config.webhookPort;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

hook.use(express.raw({ type: 'application/json' }));
hook.post('/webhook', webhook);

mongoConnect();

app.use('/shoes', express.static('./public/shoes'));
app.use('/categories', express.static('./public/categories'));

app.use('/api', routes);
app.use(customErrorRes);

app.listen(port, function () {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${port}`);
});

hook.listen(webhookPort, function () {
    // eslint-disable-next-line no-console
    console.log(`Webhook is listening on port ${webhookPort}`);
});
