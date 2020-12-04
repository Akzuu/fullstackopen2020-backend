const express = require('express');
const morgan = require('morgan');

const app = express();

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(express.json());
app.use(morgan((tokens, req, res) => [
  tokens.method(req, res),
  tokens.url(req, res),
  tokens.status(req, res),
  tokens.res(req, res, 'content-length'), '-',
  tokens['response-time'](req, res), 'ms',
  tokens.body(req),
].join(' ')));

const PERSONS_API_PREFIX = '/api/persons';
const PORT = 3000;

let db = [
  {
    name: 'Esko Valtaoja',
    number: '123214124515',
    id: 1,
  },
  {
    name: 'sadas',
    number: 'dsadas',
    id: 2,
  },
  {
    name: '321312',
    number: '3213144',
    id: 3,
  },
];

app.get(`${PERSONS_API_PREFIX}`, (req, res) => {
  res.send(db);
});

app.get(`${PERSONS_API_PREFIX}/:id`, (req, res) => {
  const { id } = req.params;

  const person = db.find((per) => per.id === Number(id));

  if (!person) {
    res.status(404).send({ error: 'Not Found' });
    return;
  }

  res.send(person);
});

app.delete(`${PERSONS_API_PREFIX}/:id`, (req, res) => {
  const { id } = req.params;

  db = db.filter((per) => per.id !== Number(id));

  res.send({ status: 'OK' });
});

app.post(`${PERSONS_API_PREFIX}`, (req, res) => {
  const { body } = req;

  if (!body) {
    res.status(400).send({ error: 'No body' });
    return;
  }
  if (!body.name) {
    res.status(400).send({ error: 'Body missing name' });
    return;
  }
  if (!body.number) {
    res.status(400).send({ error: 'Body missing number' });
    return;
  }
  if (db.filter((per) => per.name === body.name).length > 0) {
    res.status(400).send({ error: 'Name must be unique' });
    return;
  }

  const payload = body;

  payload.id = Math.floor(Math.random() * 99999999);
  db.push(payload);

  res.status(201).send({ status: 'OK' });
});

app.get('/info', (req, res) => {
  const date = new Date();
  res.send(`Phonebook has info for ${db.length} people. Request date: ${date.toTimeString()}`);
});

app.listen(PORT, () => {
  console.log(`Running server on ${PORT}`);
});
