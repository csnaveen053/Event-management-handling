from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session

import models
import schemas



def get_events(db: Session, event_date: Optional[date] = None) -> List[models.Event]:
    query = db.query(models.Event)
    if event_date is not None:
        query = query.filter(models.Event.date == event_date)
    return query.order_by(models.Event.id).all()


def get_event(db: Session, event_id: int) -> Optional[models.Event]:
    return db.query(models.Event).filter(models.Event.id == event_id).first()


def create_event(db: Session, event: schemas.EventCreate) -> models.Event:
    db_event = models.Event(
        title=event.title,
        description=event.description,
        date=event.date,
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def update_event(
    db: Session, event_id: int, event: schemas.EventUpdate
) -> Optional[models.Event]:
    db_event = get_event(db, event_id)
    if not db_event:
        return None

    update_data = event.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_event, field, value)

    db.commit()
    db.refresh(db_event)
    return db_event


def delete_event(db: Session, event_id: int) -> bool:
    db_event = get_event(db, event_id)
    if not db_event:
        return False
    db.delete(db_event)
    db.commit()
    return True
