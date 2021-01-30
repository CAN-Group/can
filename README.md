<p align="center">
  <img src="/can-frontend/public/images/logo.png" width="210" height="68">
</p>

<p align="center">
  <em>
    A student project created by 
    <a href="https://github.com/Yamsha75">Yamsha75</a>,
    <a href="https://github.com/maciejczaja">maciejczaja</a>,
    <a href="https://github.com/Tamasa94">Tamasa94</a>,
    <a href="https://github.com/Glifu">Glifu</a>,
    <a href="https://github.com/Nieminik">Nieminik</a>
  </em>
</p>


## Getting started

### Prerequisites
* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)

### Get it up and running
First, set *POSTGRESS_PASSWORD* environment variable to a desired value (it can be any non-empty string).

on Unix systems: `export POSTGRESS_PASSWORD=<password>` 

on Windows: `set POSTGRESS_PASSWORD=<password>`

<hr />

Then build all the required images.

```
docker-compose build
```


It's time to start up the composition. 

```
docker-compose up -d
```

The last thing to do is to run the **get_segments.sh** from the router container.


```
docker exec -it can_router_1 /bin/sh -c "chmod +x /app/get_segments.sh && /app/get_segments.sh"
```
