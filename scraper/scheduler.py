from apscheduler.executors.pool import ThreadPoolExecutor
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.schedulers.asyncio import AsyncIOScheduler

import scrape
import settings

jobstores = {"default": SQLAlchemyJobStore(url=settings.JOBSTORES_URI)}
executors = {"default": ThreadPoolExecutor(1)}
job_defaults = {"coalesce": True, "max_instances": 1, "misfire_grace_time": 3600}

scheduler = AsyncIOScheduler(
    jobstores=jobstores, executors=executors, job_defaults=job_defaults
)

scheduler.add_job(**scrape.job)
