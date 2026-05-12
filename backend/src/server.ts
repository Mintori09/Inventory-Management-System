import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.port, () => {
  console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
});

export default server;
