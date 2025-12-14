import operationsAxios from "../../utils/axios";
import { httpStatus } from "../../utils/httpStatus";

const DATASET_OPERATIONS = ["/head", "/tail", "/info", "/describe", "/columns"];

const operationsController = {
  getDatasetOperations: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const url = req.query.url;
    if (!url) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Dataset URL is required" });
    }

    try {
      const results = await Promise.all(
        DATASET_OPERATIONS.map(async (operationPath) => {
          const response = await operationsAxios.get(
            `/dataset${operationPath}?url=${url}`
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
};

export default operationsController;
