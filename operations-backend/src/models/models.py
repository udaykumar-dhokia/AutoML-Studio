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
    method: str


class OutlierRequest(BaseModel):
    url: str
    column: str
    method: str
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


class TrainTestSplitRequest(BaseModel):
    url: str
    test_size: float = 0.2
    random_state: int | None = 42
    shuffle: bool = True
    stratify_column: str | None = None


class LinearRegressionRequest(BaseModel):
    url: str
    features: list[str]
    target: str
    test_size: float = 0.2
    random_state: int = 42
