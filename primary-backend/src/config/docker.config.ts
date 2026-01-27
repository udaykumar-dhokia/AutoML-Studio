import Docker from "dockerode";
import "dotenv/config";

const { DOCKER_SOCKET_PATH, DOCKER_HOST, DOCKER_TLS_VERIFY } = process.env;

let docker: Docker;

if (DOCKER_HOST) {
  // Remote Docker host
  docker = new Docker({
    host: DOCKER_HOST,
    tls: DOCKER_TLS_VERIFY === "1",
  });
} else if (DOCKER_SOCKET_PATH) {
  // Local socket (Linux / Mac / Windows)
  docker = new Docker({
    socketPath: DOCKER_SOCKET_PATH,
  });
} else {
  throw new Error(
    "Docker configuration missing. Set DOCKER_SOCKET_PATH or DOCKER_HOST.",
  );
}

export default docker;
