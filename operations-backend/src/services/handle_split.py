from fastapi import HTTPException
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from ..models.models import TrainTestSplitRequest


def handle_train_test_split(request: TrainTestSplitRequest):
    try:
        df = pd.read_csv(request.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading dataset: {str(e)}")

    if request.stratify_column:
        if request.stratify_column not in df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Stratify column '{request.stratify_column}' not found",
            )
        stratify = df[request.stratify_column]
    else:
        stratify = None

    try:
        train_df, test_df = train_test_split(
            df,
            test_size=request.test_size,
            random_state=request.random_state,
            shuffle=request.shuffle,
            stratify=stratify,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error during split: {str(e)}")

    return {
        "train_size": len(train_df),
        "test_size": len(test_df),
        "total_size": len(df),
        "train_head": train_df.head().replace({np.nan: None}).to_dict(orient="records"),
        "test_head": test_df.head().replace({np.nan: None}).to_dict(orient="records"),
        "columns": df.columns.tolist(),
    }
