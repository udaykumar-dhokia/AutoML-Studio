from fastapi import APIRouter
import pandas as pd
from pydantic import BaseModel
import numpy as np

class MissingValueRequest(BaseModel):
    url: str
    strategy: str
    column: str


router = APIRouter()

@router.get("/head")
def head(url: str):
    df = pd.read_csv(url)
    return df.head().replace({np.nan: None}).to_dict(orient="records")

@router.get("/tail")
def tail(url: str):
    df = pd.read_csv(url)
    return df.tail().replace({np.nan: None}).to_dict(orient="records")

@router.get("/describe")
def describe(url: str):
    df = pd.read_csv(url)
    return df.describe().replace({np.nan: None}).to_dict()

@router.get("/info")
def info(url: str):
    df = pd.read_csv(url)
    return {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "column_info": {
            col: {
                "dtype": str(df[col].dtype),    
                "null_count": int(df[col].isna().sum()),
                "unique_count": int(df[col].nunique()),
            }
            for col in df.columns
        }
    }
   

@router.get("/columns")
def columns(url: str):
    df = pd.read_csv(url)
    return df.columns.to_list()

@router.post("/handle_missing_values")
def handle_missing_values(request: MissingValueRequest):
    df = pd.read_csv(request.url)

    column = request.column
    strategy = request.strategy

    if column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column}' not found")

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