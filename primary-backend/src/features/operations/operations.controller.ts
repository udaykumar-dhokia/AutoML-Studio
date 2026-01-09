import operationsAxios from "../../utils/axios";
import { httpStatus } from "../../utils/httpStatus";
import datasetDao from "../dataset/dataset.dao";

const DATASET_OPERATIONS = ["/head", "/tail", "/info", "/describe", "/columns"];

const operationsController = {
  getDatasetOperations: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const id = req.query.id;
    if (!id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Dataset ID is required" });
    }

    try {
      const dataset = await datasetDao.getDatasetById(id);
      if (!dataset) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Dataset not found" });
      }

      const results = await Promise.all(
        DATASET_OPERATIONS.map(async (operationPath) => {
          const response = await operationsAxios.get(
            `/dataset${operationPath}?url=${dataset.url}`
          );
          const operationKey = operationPath.substring(1);
          return { [operationKey]: response.data };
        })
      );

      const combinedResults = results.reduce(
        (acc, current) => ({ ...acc, ...current }),
        {}
      );

      return res.status(httpStatus.OK).json(combinedResults);
    } catch (error: any) {
      console.log(error);
      const message = error.response?.data?.detail || "Something went wrong";
      return res
        .status(error.response?.status || httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message });
    }
  },
  handleMissingValues: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { id, strategy, column } = req.body;
    if (!id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Dataset ID is required" });
    }

    try {
      const dataset = await datasetDao.getDatasetById(id);
      if (!dataset) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Dataset not found" });
      }

      const response = await operationsAxios.post(
        `/dataset/handle_missing_values`,
        { url: dataset.url, strategy, column }
      );
      const combinedResults = { handle_missing_values: response.data };

      return res.status(httpStatus.OK).json(combinedResults);
    } catch (error: any) {
      console.log(error);
      const message = error.response?.data?.detail || "Something went wrong";
      return res
        .status(error.response?.status || httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message });
    }
  },
  univariateAnalysis: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { id, column, visualiseType } = req.body;
    if (!id || !column || !visualiseType) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Dataset ID, column, and visualise type are required",
      });
    }

    try {
      const dataset = await datasetDao.getDatasetById(id);
      if (!dataset) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Dataset not found" });
      }

      const response = await operationsAxios.post(
        `/dataset/visualise/univariate`,
        {
          url: dataset.url,
          column,
          visualiseType,
        },
        {
          responseType: "arraybuffer",
        }
      );

      const base64Image = Buffer.from(response.data, "binary").toString(
        "base64"
      );
      const combinedResults = { univariate_analysis: base64Image };

      return res.status(httpStatus.OK).json(combinedResults);
    } catch (error: any) {
      console.log(error);
      const message = error.response?.data?.detail || "Something went wrong"; // For arraybuffer responses, might need blob handling if JSON error is returned as text, but usually status code is enough to bubble up via axios interceptor or checks. However, if visualising fails, FastAPI sends JSON. Axios trying to parse arraybuffer might hide JSON.
      // If responseType is arraybuffer, axios might not parse JSON error automatically. 
      // We might need to handle parsing if it's an error.
      if (error.response?.data && error.response.data instanceof Buffer) {
        try {
          const jsonError = JSON.parse(error.response.data.toString());
          if (jsonError.detail) {
            return res.status(error.response.status).json({ message: jsonError.detail });
          }
        } catch (e) {
          // ignore
        }
      }

      return res
        .status(error.response?.status || httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: message });
    }
  },
  bivariateAnalysis: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { id, column, visualiseType } = req.body;
    if (!id || !column || !visualiseType) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Dataset ID, column, and visualise type are required",
      });
    }

    try {
      const dataset = await datasetDao.getDatasetById(id);
      if (!dataset) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Dataset not found" });
      }

      const response = await operationsAxios.post(
        `/dataset/visualise/bivariate`,
        {
          url: dataset.url,
          column,
          target: req.body.target,
          visualiseType,
        },
        {
          responseType: "arraybuffer",
        }
      );

      const base64Image = Buffer.from(response.data, "binary").toString(
        "base64"
      );
      const combinedResults = { bivariate_analysis: base64Image };

      return res.status(httpStatus.OK).json(combinedResults);
    } catch (error: any) {
      console.log(error);
      const message = error.response?.data?.detail || "Something went wrong";

      if (error.response?.data && error.response.data instanceof Buffer) {
        try {
          const jsonError = JSON.parse(error.response.data.toString());
          if (jsonError.detail) {
            return res.status(error.response.status).json({ message: jsonError.detail });
          }
        } catch (e) {
          // ignore
        }
      }

      return res
        .status(error.response?.status || httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message });
    }
  },
};

export default operationsController;
