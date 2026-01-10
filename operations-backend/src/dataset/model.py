from pydantic import BaseModel
    
class MissingValueRequest(BaseModel):
    url: str
    strategy: str
    column: str

class VisualiseUnivariateRequest(BaseModel):
    url: str
    column: str
    visualiseType: str

class VisualiseBivariateRequest(BaseModel):
    url: str
    column: str
    target: str
    visualiseType: str

