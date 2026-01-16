from fastapi import APIRouter, HTTPException
import pandas as pd
from pydantic import BaseModel
import numpy as np
from .visualisation import visualise_univariate, visualise_bivariate
from .model import MissingValueRequest, VisualiseUnivariateRequest, VisualiseBivariateRequest, NormalizationRequest, StandardizationRequest, OutlierRequest
from .handle_missing_values import handle_missing_values
from .handle_outliers import handle_outliers
from .handle_normalization import handle_normalization
from .handle_standardization import handle_standardization
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
def missing_values(request: MissingValueRequest):
    return handle_missing_values(request)

@router.post("/handle_outliers")
def outliers(request: OutlierRequest):
    return handle_outliers(request)
@router.post("/handle_normalization")
def normalization(request: NormalizationRequest):
    return handle_normalization(request)
@router.post("/handle_standardization")
def standardization(request: StandardizationRequest):
    return handle_standardization(request)    
@router.post("/visualise/univariate")
def univariate(request: VisualiseUnivariateRequest):
    return visualise_univariate(request)

@router.post("/visualise/bivariate")
def bivariate(request: VisualiseBivariateRequest):
    return visualise_bivariate(request)
