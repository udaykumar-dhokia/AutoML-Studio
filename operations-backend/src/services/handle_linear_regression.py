from fastapi import HTTPException
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from ..models.models import LinearRegressionRequest


def handle_linear_regression(request: LinearRegressionRequest):
    try:
        df = pd.read_csv(request.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading dataset: {str(e)}")

    if request.target not in df.columns:
        raise HTTPException(
            status_code=400, detail=f"Target column '{request.target}' not found"
        )

    for feature in request.features:
        if feature not in df.columns:
            raise HTTPException(
                status_code=400, detail=f"Feature column '{feature}' not found"
            )

    X = df[request.features]
    y = df[request.target]

    non_numeric_features = X.select_dtypes(exclude=[np.number]).columns.tolist()
    if non_numeric_features:
        raise HTTPException(
            status_code=400,
            detail=f"Feature(s) {non_numeric_features} are not numeric. Please preprocess them first.",
        )

    if not pd.api.types.is_numeric_dtype(y):
        raise HTTPException(
            status_code=400,
            detail=f"Target column '{request.target}' is not numeric. Linear Regression requires a numeric target.",
        )

    try:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=request.test_size, random_state=request.random_state
        )

        model = LinearRegression()
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)

        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        predictions_cmp = []
        y_test_list = y_test.tolist()
        for i in range(min(10, len(y_test))):
            predictions_cmp.append(
                {"actual": float(y_test_list[i]), "predicted": float(y_pred[i])}
            )

        return {
            "mse": float(mse),
            "r2": float(r2),
            "coefficients": dict(zip(request.features, model.coef_.tolist())),
            "intercept": float(model.intercept_),
            "predictions": predictions_cmp,
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error during training: {str(e)}")
