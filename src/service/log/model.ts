export type ILogLevel =
 | 'debug'
 | 'info'
 | 'warn'
 | 'error';

export interface ILogOptions {
  level: ILogLevel;
}

export type ILogPayload = Record<string, string>;

export interface ILogTransporter {
  readonly id: string;
  transport(tag: string, message: string, options?: ILogOptions): void;
  flush(): void;
}

export interface ILogService {
  log(tag: string, message: string, level: ILogLevel, payload?: ILogPayload): void;
  debug(tag: string, message: string, payload?: ILogPayload): void;
  info(tag: string, message: string, payload?: ILogPayload): void;
  warn(tag: string, message: string, payload?: ILogPayload): void;
  error(tag: string, message: string, payload?: ILogPayload): void;
  addLabel(key: string, value: string): void;
  removeLabel(key: string): void;
  flush(): void;
}
