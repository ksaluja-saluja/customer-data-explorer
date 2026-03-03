
//TODO: Implement a more robust logging system, possibly using a library like Winston or Bunyan.
export class Logger {
  private static logLevel: string = process.env.LOG_LEVEL || "info";

  // Log an info message
  static info(message: string, ...optionalParams: any[]): void {
    if (this.shouldLog("info")) {
      console.log(`[INFO] [${new Date().toISOString()}]: ${message}`, ...optionalParams);
    }
  }

  // Log a debug message
  static debug(message: string, ...optionalParams: any[]): void {
    if (this.shouldLog("debug")) {
      console.debug(`[DEBUG] [${new Date().toISOString()}]: ${message}`, ...optionalParams);
    }
  }

  // Log an error message
  static error(message: string, ...optionalParams: any[]): void {
    if (this.shouldLog("error")) {
      console.error(`[ERROR] [${new Date().toISOString()}]: ${message}`, ...optionalParams);
    }
  }

  // Determine if the message should be logged based on the log level
  private static shouldLog(level: string): boolean {
    const levels = ["debug", "info", "error"];
    const currentLevelIndex = levels.indexOf(this.logLevel.toLowerCase());
    const messageLevelIndex = levels.indexOf(level.toLowerCase());
    return messageLevelIndex >= currentLevelIndex;
  }
}
