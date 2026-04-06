
const allowedOrigins = process.env.ENV_NODE === 'production'
  ? ['http://myfrontend.com'] // frontend domain
  : ['http://localhost:5173'] // frontend react vite


export const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin like postman & origins match w/ allowedOrigins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true) // (no error, allow request)
    } else {
      callback(new Error(`CORS Error: ${origin} not allowed`));
    }
  },
  credentials: true, // allow cookies, auth headers
}