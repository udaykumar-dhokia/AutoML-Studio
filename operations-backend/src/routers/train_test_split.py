from fastapi import APIRouter
from ..models.models import TrainTestSplitRequest
from ..services.handle_split import handle_train_test_split

router = APIRouter()


@router.post("/train-test-split")
def train_test_split(request: TrainTestSplitRequest):
    return handle_train_test_split(request)
