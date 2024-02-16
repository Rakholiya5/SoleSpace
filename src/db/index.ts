import { connect, disconnect } from 'mongoose';
import { config } from '../services/config';

const mongoUrl = config.mongoUri;

export async function mongoConnect() {
    try {
        await connect(mongoUrl);
        // eslint-disable-next-line no-console
        console.log('Connected to MongoDB');
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    await disconnect();
    process.exit(0);
});
