"use strict";
import { ClientSession, startSession } from "mongoose";

/**
 * for isolation of transaction
 * It handles session management and model instantiation.
 */
export default class SessionService {
  private session: ClientSession | undefined;

  protected constructor() {}

  public getSession(): ClientSession {
    if (!this.session) {
      throw new Error("Session has not been started.");
    }
    return this.session;
  }

  public async startSession(): Promise<void> {
    this.session = await startSession();
  }

  public startTransaction(): void {
    if (!this.session) {
      throw new Error("Session has not been started.");
    }
    this.session.startTransaction();
  }

  public async commitTransaction(): Promise<void> {
    if (!this.session) {
      throw new Error("Session has not been started.");
    }
    await this.session.commitTransaction();
  }

  public async abortTransaction(): Promise<void> {
    if (!this.session) {
      throw new Error("Session has not been started.");
    }
    await this.session.abortTransaction();
  }

  public async endSession(): Promise<void> {
    if (!this.session) {
      throw new Error("Session has not been started.");
    }
    await this.session.endSession();
    this.session = undefined;
  }
}
