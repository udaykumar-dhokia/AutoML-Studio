import redisClient from "../../config/redis.config";
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

      const cacheKey = `dataset_operations_${id}`;
      const cachedResults = await redisClient.get(cacheKey);
      if (cachedResults) {
        return res
          .status(httpStatus.OK)
          .json(JSON.parse(cachedResults.toString()));
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

      await redisClient.set(cacheKey, JSON.stringify(combinedResults), {
        EX: 60 * 60,
      });

      return res.status(httpStatus.OK).json(combinedResults);
    } catch (error: any) {
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
      const message = error.response?.data?.detail || "Something went wrong";
      return res
        .status(error.response?.status || httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message });
    }
  },
  handleOutliers: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { id, method, column } = req.body;
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

      const response = await operationsAxios.post(`/dataset/handle_outliers`, {
        url: dataset.url,
        method,
        column,
      });
      const combinedResults = { handle_outliers: response.data };

      return res.status(httpStatus.OK).json(combinedResults);
    } catch (error: any) {
      const message = error.response?.data?.detail || "Something went wrong";
      return res
        .status(error.response?.status || httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message });
    }
  },
  handleNormalization: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { id, method, column } = req.body;
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
        `/dataset/handle_normalization`,
        { url: dataset.url, method, column }
      );
      const combinedResults = { handle_normalization: response.data };

      return res.status(httpStatus.OK).json(combinedResults);
    } catch (error: any) {
      const message = error.response?.data?.detail || "Something went wrong";
      return res
        .status(error.response?.status || httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message });
    }
  },
  handleStandardization: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { id, column } = req.body;
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
        `/dataset/handle_standardization`,
        { url: dataset.url, column }
      );
      const combinedResults = { handle_standardization: response.data };

      return res.status(httpStatus.OK).json(combinedResults);
    } catch (error: any) {
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
      const message = error.response?.data?.detail || "Something went wrong";
      if (error.response?.data && error.response.data instanceof Buffer) {
        try {
          const jsonError = JSON.parse(error.response.data.toString());
          if (jsonError.detail) {
            return res
              .status(error.response.status)
              .json({ message: jsonError.detail });
          }
        } catch (e) { }
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
      const message = error.response?.data?.detail || "Something went wrong";

      if (error.response?.data && error.response.data instanceof Buffer) {
        try {
          const jsonError = JSON.parse(error.response.data.toString());
          if (jsonError.detail) {
            return res
              .status(error.response.status)
              .json({ message: jsonError.detail });
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

  handleTrainTestSplit: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { id, test_size, random_state, shuffle, stratify_column } = req.body;
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
        `/train-test-split/train-test-split`,
        {
          url: dataset.url,
          test_size,
          random_state,
          shuffle,
          stratify_column,
        }
      );

      return res.status(httpStatus.OK).json(response.data);
    } catch (error: any) {
      const message = error.response?.data?.detail || "Something went wrong";
      return res
        .status(error.response?.status || httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message });
    }
  },
};

export default operationsController;
