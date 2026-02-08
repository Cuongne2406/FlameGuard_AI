from pydantic import BaseModel
from typing import List, Optional

class StatItem(BaseModel):
    value: str
    trend: str
    change: str

class StudentStats(BaseModel):
    points: StatItem
    events: StatItem
    rank: StatItem

class TaskItem(BaseModel):
    id: int
    title: str
    time: str
    location: str
    status: str
    requireAttendance: bool

class StudentDashboardResponse(BaseModel):
    stats: StudentStats
    tasks: List[TaskItem]