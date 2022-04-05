import shutdownPack from "@moebius/http-graceful-shutdown";
import { Server } from "http";
import { ChildWrapper } from "./childWrapperType.js";
const GracefulShutdownManager = shutdownPack.GracefulShutdownManager;

let shutDownCalled = false;

const shutDown = (server: Server, childArray: Array<ChildWrapper>) => {
  if (!shutDownCalled) {
    shutDownCalled = true;
    const shutdownManager = new GracefulShutdownManager(server);
    shutdownManager.terminate(() => {
      childArray.forEach((wrapper) => {
        console.log(`killing child with id: ${wrapper.id}`);
        wrapper.child.kill();
      });
      console.log("shut down complete, exiting...");
      process.exit(0);
    });
  }
};

export { shutDown };
