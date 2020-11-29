# Bulding and running brouter

## 1. Standalone

### Building

- Requirements:
1. Java Development Kit 7 or newer (tested on OpenJDK 1.7.0_211 and 15.0.1)
2. Maven 3.6.x

- Steps:
1. Set current directory to `./can/brouter`
2. Execute command:

    ```sh
    mvn clean install -pl '!brouter-routing-app' '-Dmaven.javadoc.skip=true' -DskipTests
    ```

3. Resulting .jar can be found in `./can/brouter/brouter-server/target/`.

    Only `brouter-server-1.6.1-jar-with-dependencies.jar` is used.

### Running

- Requirements:
1. Java Runtime Environment 7 or newer (tested on OpenJDK RE 1.7.0_211 and 15.0.1)

- Steps:
1. Create directory for map segments at path: `./can/brouter/misc/segments4` and populate it with proper .rd5 files (consult `./docs/Segments.md`)
2. Set current directory to `./can/brouter/misc/scripts/standalone`
3. Execute `server.cmd` or `server.sh`

## 2. In Docker

### Building

- Requirements:
1. Docker

- Steps:
1. Set current directory to `./can/brouter`
2. Execute command:

    ```sh
    docker build -t can/brouter:<tag> .
    ```

    For testing purposes use tag `test`

### Running

- Requirements:
1. Docker

- Steps:
1. Execute command:

    ```sh
    docker run --rm -it --name brouter -v <path>:/app/segments4 -p 17777:17777 can/brouter:<tag>
    ```

    path should be an **absolute** path to a directory with downloaded segments on the host filesystem. `/app/segments4` is where it will be mounted in the container

    Use flag `--detached` to run container in the background
