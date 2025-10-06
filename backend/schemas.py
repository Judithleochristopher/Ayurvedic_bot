from pydantic import BaseModel

class HerbBase(BaseModel):
    name: str
    properties: str
    usage: str

class HerbCreate(HerbBase):
    pass

class Herb(HerbBase):
    id: int

    class Config:
        orm_mode = True
