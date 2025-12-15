import { Readable } from "node:stream";
import cloudinary from "../../config/cloudinary.config";
import { httpStatus } from "../../utils/httpStatus";
import datasetDao from "./dataset.dao";
import { TDataset } from "./dataset.type";

const datasetController = {
  getDataset: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }
    try {
      const dataset = await datasetDao.getDatasetByUserId(userId);
      return res.status(httpStatus.OK).json(dataset);
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  },
  createDataset: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    if (!req.file)
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "No file uploaded" });

    const { name, description } = req.body;

    try {
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: `AutoML-Studio/dataset/${userId}`,
              resource_type: "raw",
              use_filename: true,
              unique_filename: false,
              filename_override: req.file.originalname,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          Readable.from(req.file.buffer).pipe(stream);
        });
      };

      const uploadResult: any = await uploadToCloudinary();

      const payload: TDataset = {
        name,
        description,
        userId,
        url: uploadResult.secure_url,
        d_id: uploadResult.public_id,
      };

      const dataset = await datasetDao.createDataset(payload);
      return res.status(httpStatus.OK).json(dataset);
    } catch (error) {
      console.log(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  },

  deleteDataset: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    if (!id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "No id provided" });
    }

    try {
      const dataset = await datasetDao.getDatasetById(id);

      if (!dataset) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Dataset not found" });
      }

      console.log(dataset.userId, userId);

      if (dataset.userId.toString() !== userId) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      try {
        await cloudinary.uploader.destroy(dataset.d_id, {
          resource_type: "raw",
        });
      } catch (err) {
        console.warn("Cloudinary delete failed:", err);
      }

      const deletedDataset = await datasetDao.deleteDatasetById(id);

      return res.status(httpStatus.OK).json({
        message: "Dataset deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  },
};
export default datasetController;
