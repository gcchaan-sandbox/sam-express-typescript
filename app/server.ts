import app from './app';

const port = process.env['PORT'] || 8080;
const env = process.env.ENV;

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
    console.log(`env: '${env}'`);
});
