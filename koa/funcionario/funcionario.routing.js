const Router = require('koa-router');
const db = require('rethinkdb');

const router = new Router({
    prefix: '/funcionarios'
});

router.get('/', async (ctx, next) => {
    const cursor = await db.table('funcionarios').run(ctx.conn);
    
    ctx.body = await cursor.toArray();
});

router.get('/:id', async (ctx, next) => {
    ctx.body = await db.table('funcionarios')
                       .get(parseInt(ctx.params.id)).run(ctx.conn);
});

router.post('/', async (ctx, next) => {
    await db.table('funcionarios')
            .insert(ctx.request.body)
            .run(ctx.conn);
    ctx.body = ctx.request.body;
    ctx.status = 201;
});

router.put('/:id', async (ctx, next) => {
    await db.table('funcionarios').get(+ctx.params.id)
            .update(ctx.request.body).run(ctx.conn);
    ctx.body = ctx.request.body;
});

router.delete('/:id', async (ctx, next) => {
    await db.table('funcionarios').get(+ctx.params.id)
            .delete().run(ctx.conn);
    ctx.body = 'Excluído';
});

module.exports = router;
