from fastapi import HTTPException
import pandas as pd
import numpy as np
from .model import MissingValueRequest

def handle_missing_values(request: MissingValueRequest):
    df = pd.read_csv(request.url)

    column = request.column
    strategy = request.strategy

    if column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column}' not found")
    
    is_numeric = pd.api.types.is_numeric_dtype(df[column])

    if strategy in ["Replace with Mean", "Replace with Median", "Replace with Min", "Replace with Max"] and not is_numeric:
        raise HTTPException(status_code=400, detail=f"Strategy '{strategy}' requires a numeric column")

    if strategy == "Drop Rows":
        df = df.dropna(subset=[column])
    elif strategy == "Replace with Mean":
        df[column] = df[column].fillna(df[column].mean())
    elif strategy == "Replace with Median":
        df[column] = df[column].fillna(df[column].median())
    elif strategy == "Replace with Min":
        df[column] = df[column].fillna(df[column].min())
    elif strategy == "Replace with Max":
        df[column] = df[column].fillna(df[column].max())
    else:
        raise HTTPException(status_code=400, detail="Invalid strategy")

    return {
        "columns": df.columns.tolist(),
        "data": df.head().replace({np.nan: None}).to_dict(orient="records"),
        "null_count": int(df[column].isna().sum()),
    }