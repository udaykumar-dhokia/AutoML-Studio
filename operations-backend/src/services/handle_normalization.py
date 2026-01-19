from fastapi import HTTPException
import pandas as pd
import numpy as np
from ..models.models import NormalizationRequest


def handle_normalization(request: NormalizationRequest):
    df = pd.read_csv(request.url)

    column = request.column
    method = request.method

    if column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column}' not found")

    if not pd.api.types.is_numeric_dtype(df[column]):
        raise HTTPException(
            status_code=400, detail="Normalization requires a numeric column"
        )

    if method == "Min-Max Scaling":
        min_val = df[column].min()
        max_val = df[column].max()

        if min_val == max_val:
            raise HTTPException(
                status_code=400,
                detail="Min and Max are equal; cannot apply Min-Max scaling",
            )

        df[column] = (df[column] - min_val) / (max_val - min_val)

    elif method == "Max Abs Scaling":
        max_abs = df[column].abs().max()

        if max_abs == 0:
            raise HTTPException(
                status_code=400, detail="Maximum absolute value is 0; cannot scale"
            )

        df[column] = df[column] / max_abs

    else:
        raise HTTPException(status_code=400, detail="Invalid normalization method")

    return {
        "method": method,
        "column": column,
        "columns": df.columns.tolist(),
        "data": df.head().replace({np.nan: None}).to_dict(orient="records"),
    }
