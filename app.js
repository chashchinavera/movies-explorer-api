require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
const { limiterConfiguration } = require("./utils/constants");
const { errors } = require("celebrate");
const router = require("./routes");
const error = require("./middlewares/error");
const { requestLogger, errorLogger } = require("./middlewares/logCollector");
const cors = require("./middlewares/cors");
const { DB_ADDRESS } = require("./utils/constants");
const limiter = rateLimiter(limiterConfiguration);

mongoose.connect(DB_ADDRESS);

const { PORT = 3001 } = process.env;

const app = express();

app.use(limiter);

app.use(helmet());

app.use(express.json());

app.use(cors);

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(error);

app.listen(PORT);
