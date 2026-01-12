from pydantic import BaseModel
    
class MissingValueRequest(BaseModel):
    url: str
    strategy: str
    column: str
class StandardizationRequest(BaseModel):
    url: str
    column: str
class NormalizationRequest(BaseModel):
    url: str
    column: str
    method: str  # Min-Max | Max-Abs
class OutlierRequest(BaseModel):
    url: str
    column: str
    method: str  # IQR | Z-Score | Capping
    threshold: float | None = None

class VisualiseUnivariateRequest(BaseModel):
    url: str
    column: str
    visualiseType: str

class VisualiseBivariateRequest(BaseModel):
    url: str
    column: str
    target: str
    visualiseType: str

