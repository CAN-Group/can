from apscheduler.triggers.cron import CronTrigger

from database import DBSession


def scrape():
    # TODO scrape
    db_session = DBSession()
    print("scraping...")


trigger = CronTrigger(hour="00,12", minutes="0")

job = {
    "func": scrape,
    "id": "scrape_job",
    "trigger": trigger,
    "replace_existing": True,
}
