import Dataset from "./dataset.model";
import { TDataset } from "./dataset.type";

class DatasetDao {
  getDatasetByUserId(userId: string) {
    return Dataset.find({ userId });
  }

  createDataset(dataset: TDataset) {
    return Dataset.create(dataset);
  }
}

export default new DatasetDao();
