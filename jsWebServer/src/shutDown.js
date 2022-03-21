const shutdownPack = require("@moebius/http-graceful-shutdown");
const GracefulShutdownManager = shutdownPack.GracefulShutdownManager;

let shutDownCalled = false;

const shutDown = (server, childArray) => {
  if (!shutDownCalled) {
    shutDownCalled = true;
    const shutdownManager = new GracefulShutdownManager(server);
    shutdownManager.terminate(() => {
      childArray.forEach((obj) => {
        console.log(`killing child with id: ${obj.id}`);
        obj.child.kill();
      });
      console.log("shut down complete, exiting...");
      process.exit(0);
    });
  }
};

module.exports = { shutDown };
