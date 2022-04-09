import { Pool } from "../pool/pool.js";
import shutdownPack from "@moebius/http-graceful-shutdown";
import { Server } from "http";
const GracefulShutdownManager = shutdownPack.GracefulShutdownManager;

let shutDownCalled = false;

const shutDown = (server: Server, ...pools: Pool[]) => {
  if (!shutDownCalled) {
    shutDownCalled = true;
    const shutdownManager = new GracefulShutdownManager(server);
    shutdownManager.terminate(() => {
      pools.forEach((p) => p.destroy(true));
      console.log("shut down complete, exiting...");
      process.exit(0);
    });
  }
};

export { shutDown };
