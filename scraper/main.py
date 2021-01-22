import asyncio
import logging

import settings, scrape
from database import recreate_schema
from scheduler import scheduler

logging.basicConfig(
    format=(
        "%(asctime)s.%(msecs)03d [%(levelname)s] %(module)s.%(funcName)s: "
        "%(message)s"
    ),
    datefmt=r"%H:%M:%S",
)
if settings.DEBUG:
    logging.getLogger("apscheduler").setLevel(logging.DEBUG)
else:
    logging.getLogger("apscheduler").setLevel(logging.INFO)


def run():
    recreate_schema()
    scrape.scrape()
    scheduler.start()
    try:
        asyncio.get_event_loop().run_forever()
    except (KeyboardInterrupt, SystemExit):
        print("Shutting down. Please wait...")
        scheduler.shutdown(wait=True)
        exit(0)


if __name__ == "__main__":
    run()
