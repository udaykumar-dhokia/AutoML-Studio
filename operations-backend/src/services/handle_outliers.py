from fastapi import HTTPException
import pandas as pd
import numpy as np
from ..models.models import OutlierRequest


def handle_outliers(request: OutlierRequest):
    df = pd.read_csv(request.url)

    column = request.column
    method = request.method
    threshold = request.threshold or 3.0

    if column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column}' not found")

    if not pd.api.types.is_numeric_dtype(df[column]):
        raise HTTPException(
            status_code=400, detail="Outlier handling requires a numeric column"
        )

    original_count = df.shape[0]

    if method == "IQR Method":
        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR

        df = df[(df[column] >= lower) & (df[column] <= upper)]

    elif method == "Z-Score Method":
        z_scores = np.abs((df[column] - df[column].mean()) / df[column].std())
        df = df[z_scores <= threshold]

    elif method == "Capping":
        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR

        df[column] = np.clip(df[column], lower, upper)

    else:
        raise HTTPException(status_code=400, detail="Invalid outlier method")

    return {
        "method": method,
        "original_rows": original_count,
        "remaining_rows": df.shape[0],
        "columns": df.columns.tolist(),
        "data": df.head().replace({np.nan: None}).to_dict(orient="records"),
    }
