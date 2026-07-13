import app from "./app";
import { config } from "./config";
import { prisma } from "./lib/prisma";
const PORT = config.port;

async function main() {
  try {
    app.listen(PORT, async () => {
      await prisma.$connect();
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error starting the server:", error);
    process.exit(1); // Exit the process with an error code
  }
}
main();
