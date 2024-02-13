import express from 'express';
import { mongoConnect } from './src/db/';
import { customErrorRes } from './src/services/response';
import routes from './src/routes';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoConnect();

app.use('/shoes', express.static('./public/shoes'));

app.use('/api', routes);
app.use(customErrorRes);

app.listen(port, function () {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${port}`);
});
