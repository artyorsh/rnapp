import { ILogLevel, ILogPayload, ILogService, ILogTransporter } from './model';

export interface ILogServiceOptions {
  flushInterval?: number;
  transporters?: ILogTransporter[];
}

export class LogService implements ILogService {

  private transporters: ILogTransporter[] = [];

  constructor(options: ILogServiceOptions = {}) {
    this.transporters = options.transporters || [];
    const flushInterval: number = options.flushInterval || 0;

    if (flushInterval > 0) {
      setInterval(() => this.flush(), flushInterval);
    }
  }

  public log = (tag: string, message: string, level: ILogLevel, payload: ILogPayload = {}): void => {
    this.transporters.forEach(t => t.transport(tag, message, { ...payload, level }));
  };

  public debug = (tag: string, message: string, payload: ILogPayload = {}): void => {
    this.log(tag, message, 'debug', payload);
  };

  public info = (tag: string, message: string, payload: ILogPayload = {}): void => {
    this.log(tag, message, 'info', payload);
  };

  public warn = (tag: string, message: string, payload: ILogPayload = {}): void => {
    this.log(tag, message, 'warn', payload);
  };

  public error = (tag: string, message: string, payload: ILogPayload = {}): void => {
    this.log(tag, message, 'error', payload);
  };

  public flush = (): void => {
    this.transporters.forEach(t => t.flush());
  };
}
