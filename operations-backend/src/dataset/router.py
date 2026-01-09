from fastapi import APIRouter, HTTPException
import pandas as pd
from pydantic import BaseModel
import numpy as np
import uuid
from fastapi.responses import StreamingResponse
from io import BytesIO

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

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
        if not is_numeric:
            raise HTTPException(
                status_code=400,
                detail="Histogram requires a numeric column"
            )

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

@router.post("/visualise/bivariate")
def visualise_bivariate(request: VisualiseBivariateRequest):
    df = pd.read_csv(request.url)

    
    # 1. Validate Columns exist
    if request.column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{request.column}' not found")
    if request.target not in df.columns:
        raise HTTPException(status_code=400, detail=f"Target '{request.target}' not found")

    # 2. Prepare Data (Inner Join on non-nulls)
    # This prevents the ValueError: x and y must have same first dimension
    df_clean = df[[request.column, request.target]].dropna()
    
    if df_clean.empty:
        raise HTTPException(status_code=400, detail="No valid data after removing missing values")

    series = df_clean[request.column]
    target = df_clean[request.target]
    
    is_numeric_x = pd.api.types.is_numeric_dtype(series)
    is_numeric_y = pd.api.types.is_numeric_dtype(target)

    plt.figure(figsize=(10, 6)) # Unchanged size or slightly larger
    title = f"{request.visualiseType} of {request.column} vs {request.target}"

    # --- PLOTTING LOGIC ---

    if request.visualiseType in ["Scatter Plot", "Line Chart", "Heatmap"]:
        # Requirements: Both X and Y must be numeric
        if not is_numeric_x or not is_numeric_y:
            raise HTTPException(
                status_code=400,
                detail=f"{request.visualiseType} requires both '{request.column}' and '{request.target}' to be numeric."
            )
        
        # Data is already clean and aligned
        x_data = pd.to_numeric(series, errors="coerce")
        y_data = pd.to_numeric(target, errors="coerce")
        
        # Re-check alignment/emptiness just in case coercion caused nans (though dropna happened on raw)
        # It's safer to just proceed with what we have if we trust dropna, but pure numeric check is better.
        # Actually dropna on subset [col, target] handles most.
        
        if request.visualiseType == "Scatter Plot":
            plt.scatter(x_data, y_data, alpha=0.6)
            plt.xlabel(request.column)
            plt.ylabel(request.target)

        elif request.visualiseType == "Line Chart":
            # For line chart, it often makes sense to sort by X
            sorted_idx = np.argsort(x_data)
            plt.plot(x_data.iloc[sorted_idx], y_data.iloc[sorted_idx])
            plt.xlabel(request.column)
            plt.ylabel(request.target)

        elif request.visualiseType == "Heatmap":
            # 2D Histogram
            plt.hist2d(x_data, y_data, bins=30, cmap="Blues")
            plt.colorbar(label="Count")
            plt.xlabel(request.column)
            plt.ylabel(request.target)

    elif request.visualiseType in ["Box Plot", "Violin Plot"]:
        # Requirements: Target (Y) must be numeric. Column (X) is typically categorical.
        if not is_numeric_y:
            raise HTTPException(
                status_code=400,
                detail=f"{request.visualiseType} requires the target '{request.target}' to be numeric."
            )
        
        # Prepare data for plotting: list of arrays
        plot_data = []
        labels = []
        # Sort labels for consistent ordering
        try:
            unique_x_sorted = sorted(series.unique())
        except:
            unique_x_sorted = series.unique()

        for val in unique_x_sorted:
            subset = target[series == val]
            if len(subset) > 0:
                plot_data.append(subset.values)
                labels.append(str(val))
        
        if not plot_data:
             raise HTTPException(status_code=400, detail="No data available for plotting.")

        if request.visualiseType == "Box Plot":
            plt.boxplot(plot_data, labels=labels, vert=True)
        else: # Violin Plot
            # Violin plot doesn't accept 'labels' arg directly in the same way for x-ticks usually need manual
            parts = plt.violinplot(plot_data, showmeans=False, showmedians=True)
            plt.xticks(range(1, len(labels) + 1), labels)

        plt.xlabel(request.column)
        plt.ylabel(request.target)
        plt.xticks(rotation=90, ha="right")

    elif request.visualiseType in ["Bar Chart", "Bar Plot"]:
        # Bivariate Bar Chart: X (Cat) vs Y (Numeric - Aggregated?)
        # A raw "Bar Chart" of X vs Y usually implies Y is the height for category X.
        # But if there are multiple Ys for one X, we need to aggregate (mean/sum).
        # Let's assume Mean for now, or just error if duplicates? 
        # Easier: Bar Chart of Counts is Univariate. Bar Chart of Values is Bivariate.
        
        if not is_numeric_y:
            raise HTTPException(status_code=400, detail="Bar Chart target must be numeric.")
        
        # Aggregate Y by X (Mean)
        agg_data = df_clean.groupby(request.column)[request.target].mean().sort_index()
        
        plt.bar(agg_data.index.astype(str), agg_data.values)
        plt.xlabel(request.column)
        plt.ylabel(f"Mean {request.target}")
        plt.xticks(rotation=90, ha="right")

    else:
        raise HTTPException(status_code=400, detail=f"Visualisation type '{request.visualiseType}' not supported for Bivariate Analysis")

    plt.title(title)
    plt.grid(True, linestyle="--", alpha=0.5)
    plt.tight_layout()

    img = BytesIO()
    plt.savefig(img, format="png")
    plt.close()
    img.seek(0)

    return StreamingResponse(img, media_type="image/png")