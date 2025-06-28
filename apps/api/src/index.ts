import express from 'express';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema';

import dayjs from "dayjs";
import dayjsObjectSupport from "dayjs/plugin/objectSupport";
import dayjsUtc from "dayjs/plugin/utc";

dayjs.extend(dayjsObjectSupport);
dayjs.extend(dayjsUtc);

const app = express();

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
});

app.use('/graphql', yoga);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`GraphQL Yoga server running on http://localhost:${PORT}/graphql`);
});