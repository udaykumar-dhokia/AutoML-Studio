from ..models.models import VisualiseUnivariateRequest, VisualiseBivariateRequest
from io import BytesIO
from fastapi import HTTPException
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from fastapi.responses import StreamingResponse

import matplotlib

matplotlib.use("Agg")


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
                status_code=400, detail="Histogram requires a numeric column"
            )

        data = pd.to_numeric(series, errors="coerce").dropna()
        plt.hist(data, bins=20, edgecolor="black")
        plt.xlabel(request.column)
        plt.ylabel("Frequency")

    elif request.visualiseType == "Box Plot":
        if not is_numeric:
            raise HTTPException(
                status_code=400, detail="Box Plot requires a numeric column"
            )

        data = pd.to_numeric(series, errors="coerce").dropna()
        plt.boxplot(data, vert=True)
        plt.ylabel(request.column)

    elif request.visualiseType == "Pie Chart":
        value_counts = series.astype(str).value_counts()

        if value_counts.empty:
            raise HTTPException(status_code=400, detail="No valid data to plot")

        plt.pie(
            value_counts.values,
            labels=value_counts.index,
            autopct="%1.1f%%",
            startangle=90,
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


def visualise_bivariate(request: VisualiseBivariateRequest):
    df = pd.read_csv(request.url)

    if request.column not in df.columns:
        raise HTTPException(
            status_code=400, detail=f"Column '{request.column}' not found"
        )
    if request.target not in df.columns:
        raise HTTPException(
            status_code=400, detail=f"Target '{request.target}' not found"
        )

    df_clean = df[[request.column, request.target]].dropna()

    if df_clean.empty:
        raise HTTPException(
            status_code=400, detail="No valid data after removing missing values"
        )

    series = df_clean[request.column]
    target = df_clean[request.target]

    is_numeric_x = pd.api.types.is_numeric_dtype(series)
    is_numeric_y = pd.api.types.is_numeric_dtype(target)

    plt.figure(figsize=(10, 6))
    title = f"{request.visualiseType} of {request.column} vs {request.target}"

    if request.visualiseType in ["Scatter Plot", "Line Chart", "Heatmap"]:
        if not is_numeric_x or not is_numeric_y:
            raise HTTPException(
                status_code=400,
                detail=f"{request.visualiseType} requires both '{request.column}' and '{request.target}' to be numeric.",
            )

        x_data = pd.to_numeric(series, errors="coerce")
        y_data = pd.to_numeric(target, errors="coerce")

        if request.visualiseType == "Scatter Plot":
            plt.scatter(x_data, y_data, alpha=0.6)
            plt.xlabel(request.column)
            plt.ylabel(request.target)

        elif request.visualiseType == "Line Chart":
            sorted_idx = np.argsort(x_data)
            plt.plot(x_data.iloc[sorted_idx], y_data.iloc[sorted_idx])
            plt.xlabel(request.column)
            plt.ylabel(request.target)

        elif request.visualiseType == "Heatmap":
            plt.hist2d(x_data, y_data, bins=30, cmap="Blues")
            plt.colorbar(label="Count")
            plt.xlabel(request.column)
            plt.ylabel(request.target)

    elif request.visualiseType in ["Box Plot", "Violin Plot"]:
        if not is_numeric_y:
            raise HTTPException(
                status_code=400,
                detail=f"{request.visualiseType} requires the target '{request.target}' to be numeric.",
            )

        plot_data = []
        labels = []
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
            raise HTTPException(
                status_code=400, detail="No data available for plotting."
            )

        if request.visualiseType == "Box Plot":
            plt.boxplot(plot_data, labels=labels, vert=True)
        else:
            parts = plt.violinplot(plot_data, showmeans=False, showmedians=True)
            plt.xticks(range(1, len(labels) + 1), labels)

        plt.xlabel(request.column)
        plt.ylabel(request.target)
        plt.xticks(rotation=90, ha="right")

    elif request.visualiseType in ["Bar Chart", "Bar Plot"]:

        if not is_numeric_y:
            raise HTTPException(
                status_code=400, detail="Bar Chart target must be numeric."
            )

        agg_data = df_clean.groupby(request.column)[request.target].mean().sort_index()

        plt.bar(agg_data.index.astype(str), agg_data.values)
        plt.xlabel(request.column)
        plt.ylabel(f"Mean {request.target}")
        plt.xticks(rotation=90, ha="right")

    else:
        raise HTTPException(
            status_code=400,
            detail=f"Visualisation type '{request.visualiseType}' not supported for Bivariate Analysis",
        )

    plt.title(title)
    plt.grid(True, linestyle="--", alpha=0.5)
    plt.tight_layout()

    img = BytesIO()
    plt.savefig(img, format="png")
    plt.close()
    img.seek(0)

    return StreamingResponse(img, media_type="image/png")
