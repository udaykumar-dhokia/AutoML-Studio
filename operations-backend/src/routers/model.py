from fastapi import APIRouter
from ..models.models import LinearRegressionRequest
from ..services.handle_linear_regression import handle_linear_regression

router = APIRouter()


@router.post("/linear-regression")
def linear_regression(request: LinearRegressionRequest):
    return handle_linear_regression(request)
