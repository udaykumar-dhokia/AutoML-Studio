import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user.slice";
import datasetReducer from "./slices/datasets.slice";
import allWorkflowsReducer from "./slices/allWorkflows.slice";
import currentWorkflowReducer from "./slices/currentWorkflow.slice";
import nodeReducer from "./slices/node.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    dataset: datasetReducer,
    allWorkflows: allWorkflowsReducer,
    currentWorkflow: currentWorkflowReducer,
    node: nodeReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
