from apscheduler.triggers.cron import CronTrigger

from database import DBSession


def scrape():
    # TODO scrape
    pass
    # example of adding to db:
    # db_session = DBSession()
    # cases = ...
    # for case in cases:
    #     cases_record = CasesRecord(
    #         county_id=case.x,
    #         updated=case.y,
    #         number_of_cases=case.z
    #     )
    #     session.merge(cases_record)
    # session.commit()


trigger = CronTrigger(hour="00,12", minutes="0")

job = {
    "func": scrape,
    "id": "scrape_job",
    "trigger": trigger,
    "replace_existing": True,
}
