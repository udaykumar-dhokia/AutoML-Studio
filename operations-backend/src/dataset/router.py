from fastapi import APIRouter
import pandas as pd
from pydantic import BaseModel
import numpy as np
import matplotlib.pyplot as plt
import uuid
from fastapi.responses import StreamingResponse
from io import BytesIO

class MissingValueRequest(BaseModel):
    url: str
    strategy: str
    column: str

class VisualiseUnivariateRequest(BaseModel):
    url: str
    column: str
    visualiseType: str

class VisualiseBivariateRequest(BaseModel):
    url: str
    column: str
    target: str
    analysisType: str
    visualiseType: str

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

@router.post("/visualise/univariate")
def visualise_univariate(request: VisualiseUnivariateRequest):
    df = pd.read_csv(request.url)

    if request.column not in df.columns:
        raise HTTPException(status_code=400, detail="Column not found")

    series = df[request.column].dropna()
    is_numeric = pd.api.types.is_numeric_dtype(series)

    plt.figure(figsize=(8, 6))
    title = f"{request.visualiseType} of {request.column}"

    if request.visualiseType == "Histogram":


        data = pd.to_numeric(series, errors="coerce").dropna()
        plt.hist(data, bins=20, edgecolor="black")
        plt.xlabel(request.column)
        plt.ylabel("Frequency")

    elif request.visualiseType == "Box Plot":
        if not is_numeric:
            raise HTTPException(
                status_code=400,
                detail="Box Plot requires a numeric column"
            )

        data = pd.to_numeric(series, errors="coerce").dropna()
        plt.boxplot(data, vert=True)
        plt.ylabel(request.column)

    elif request.visualiseType == "Pie Chart":
        value_counts = series.astype(str).value_counts()

        if value_counts.empty:
            raise HTTPException(
                status_code=400,
                detail="No valid data to plot"
            )

        plt.pie(
            value_counts.values,
            labels=value_counts.index,
            autopct="%1.1f%%",
            startangle=90
        )
        plt.axis("equal")

    elif request.visualiseType in ["Bar Chart", "Count Plot"]:
        value_counts = series.astype(str).value_counts()

        if len(value_counts) > 15:
            plt.barh(value_counts.index, value_counts.values)
            plt.xlabel("Count")
            plt.ylabel(request.column)
        else:
            plt.bar(value_counts.index, value_counts.values)
            plt.xlabel(request.column)
            plt.ylabel("Count")
            plt.xticks(rotation=90, ha="right")

    else:
        raise HTTPException(status_code=400, detail="Invalid visualise type")

    plt.title(title)
    plt.grid(True, linestyle="--", alpha=0.5)
    plt.tight_layout()

    img = BytesIO()
    plt.savefig(img, format="png")
    plt.close()
    img.seek(0)

    return StreamingResponse(img, media_type="image/png")
