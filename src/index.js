import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema";
import { connect } from "./database";
import { main } from "./controller";
import apiRouter from "./routes/api";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
connect();

app.get('/', (req, res) => {
    res.json({
        message: 'Test message'
    })
});

app.use('/api', apiRouter);
app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}));

app.listen(process.env.PORT, () => console.log('Server on port '+process.env.PORT));