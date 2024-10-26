import Connection from "./Connection";

export default class ConnectionManager {
  private static connections: Connection[] = [];

  public static addConnection(connection: Connection): void {
    this.connections.push(connection);
  }

  public static async connect(): Promise<void> {
    await Promise.all(this.connections.map((connection) => connection.connect()));
  }

  public static async close(): Promise<void> {
    await Promise.all(this.connections.map((connection) => connection.close()));
  }
}
