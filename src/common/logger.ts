import {
  Color,
  ConsoleTransport,
  Format,
  Houston,
  LogLevel,
  LogLevelDisplay,
  TimePrefix
} from "https://deno.land/x/houston@1.0.0/mod.ts";

const config = {
  format: Format.text,
  prefix: new TimePrefix(),
  logLevelDisplay: LogLevelDisplay.Text,
  logColors: {
    [LogLevel.Info]: Color.Blue,
    [LogLevel.Success]: Color.Green,
    [LogLevel.Warning]: Color.Yellow,
    [LogLevel.Error]: Color.Red,
  }
}

export const log = new Houston(
  [
    new ConsoleTransport(),
  ],
  config
);
