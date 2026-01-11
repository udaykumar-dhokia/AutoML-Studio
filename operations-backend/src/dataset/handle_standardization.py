from fastapi import HTTPException
import pandas as pd
import numpy as np
from .model import StandardizationRequest


def handle_standardization(request: StandardizationRequest):
    df = pd.read_csv(request.url)

    column = request.column

    if column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column}' not found")

    if not pd.api.types.is_numeric_dtype(df[column]):
        raise HTTPException(
            status_code=400,
            detail="Standardization requires a numeric column"
        )

    mean = df[column].mean()
    std = df[column].std()

    if std == 0:
        raise HTTPException(
            status_code=400,
            detail="Standard deviation is 0; cannot standardize"
        )

    df[column] = (df[column] - mean) / std

    return {
        "method": "Z-Score",
        "column": column,
        "mean": mean,
        "std": std,
        "data": df.head().replace({np.nan: None}).to_dict(orient="records"),
    }
