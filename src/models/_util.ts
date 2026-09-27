import mongoose, { type Model, type Schema } from "mongoose";

/**
 * Register a model once. In development the model is rebuilt on every hot reload so schema edits
 * take effect without restarting the dev server; in production the first registration wins.
 */
export function model<T>(name: string, schema: Schema<T>): Model<T> {
  if (process.env.NODE_ENV !== "production" && mongoose.models[name]) mongoose.deleteModel(name);
  return (mongoose.models[name] as Model<T>) ?? mongoose.model<T>(name, schema);
}
