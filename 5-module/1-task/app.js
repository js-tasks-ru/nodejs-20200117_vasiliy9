const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = {};

router.get('/subscribe', async (ctx, next) => {
  const userId = Math.random();

  const message = await new Promise(function(resolve) {
    subscribers[userId] = resolve;
  });

  delete subscribers[userId];

  ctx.status = 200;
  ctx.body = message;
});

router.post('/publish', async (ctx) => {
  const {message = ''} = ctx.request.body;

  if (!message) {
    ctx.status = 200;
    return;
  }

  for (const key in subscribers) {
    if (subscribers[key]) {
      const resolve = subscribers[key];
      resolve(message);

      ctx.status = 200;
    }
  }
});

app.use(router.routes());

module.exports = app;
