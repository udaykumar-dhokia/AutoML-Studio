import Dataset from "./dataset.model";
import { TDataset } from "./dataset.type";

class DatasetDao {
  getDatasetByUserId(userId: string) {
    return Dataset.find({ userId });
  }

  createDataset(dataset: TDataset) {
    return Dataset.create(dataset);
  }

  getDatasetById(id: string) {
    return Dataset.findById(id);
  }

  deleteDatasetById(id: string) {
    return Dataset.findByIdAndDelete(id);
  }
}

export default new DatasetDao();
