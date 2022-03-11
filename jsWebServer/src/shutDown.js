const shutdownPack = require("@moebius/http-graceful-shutdown");
const GracefulShutdownManager = shutdownPack.GracefulShutdownManager;

const shutDown = (server, childArray) => {
  const shutdownManager = new GracefulShutdownManager(server);
  shutdownManager.terminate(() => {
    childArray.forEach((obj) => {
      console.log(`killing child with id: ${obj.id}`);
      obj.child.kill();
    });
    console.log("shut down complete, exiting...");
    process.exit(0);
  });
};

module.exports = { shutDown };
