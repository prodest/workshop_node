const Koa = require('koa');
const db = require('rethinkdb');
const bodyParser = require('koa-bodyparser');

const funcionariosRouter = require('./funcionario/funcionario.routing');

const app = new Koa();

app.use(bodyParser());

app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method}, ${ctx.url}, ${ms}`);
});

app.use(async (ctx, next) => {
    const conn = await db.connect('192.168.99.100');
    
    conn.use('prodest');
    ctx.conn = conn;

    try {
        await next();
    } catch (err) {
        console.error(err);
    } finally {
        conn.close();
    }
});

app.use(funcionariosRouter.routes());

app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000.');
});
