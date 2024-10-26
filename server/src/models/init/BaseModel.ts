import { Model, model, Schema } from "mongoose";
export default class BaseModel<T> {
  private model: Model<T>;
  protected constructor(name: string, schema: Schema) {
    this.model = model<T>(name, schema);
  }

  public getModel(): Model<T> {
    return this.model;
  }
}
