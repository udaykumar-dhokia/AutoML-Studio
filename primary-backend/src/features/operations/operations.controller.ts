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
    } catch (error) {
      console.log(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Something went wrong" });
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
    } catch (error) {
      console.log(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Something went wrong", error });
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
    } catch (error) {
      console.log(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Something went wrong" });
    }
  },
};

export default operationsController;
