/**
 * @description: 
 * @return {*}
 */
import { DefaultLogger } from "koatty_logger";

export const Logger = {
  debug: DefaultLogger.Debug,
  error: DefaultLogger.Error,
  info: DefaultLogger.Info,
  warn: DefaultLogger.Warn,
  log: DefaultLogger.Log,
};