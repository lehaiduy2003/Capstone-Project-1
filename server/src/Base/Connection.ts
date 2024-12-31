export default abstract class Connection {
  protected constructor() {}
  public abstract connect(): Promise<void>;
  public abstract close(): Promise<void>;
}
