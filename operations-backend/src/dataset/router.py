from fastapi import APIRouter
import pandas as pd

import numpy as np

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
