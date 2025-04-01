import RNFetchBlob, { ReactNativeBlobUtilWriteStream } from 'react-native-blob-util';

import { ILogOptions, ILogTransporter } from '../model';

interface ILogMessage {
  timestamp: number;
  message: string;
  payload: Record<string, string>;
}

export class FileLogTransporter implements ILogTransporter {

  public readonly id: string = '@log/file';

  private destination: string;

  private writeStream: ReactNativeBlobUtilWriteStream | null = null;

  private logQueue: ILogMessage[] = [];

  constructor(filename: string) {
    this.destination = `${RNFetchBlob.fs.dirs.DocumentDir}/${filename}`;

    this.createWriteStream().then(stream => {
      this.writeStream = stream;
    });
  }

  public transport = (tag: string, message: string, options?: ILogOptions): void => {
    const logMessage: ILogMessage = this.createLogMessage(tag, message, options);

    this.writeToFile(logMessage).catch(() => {
      this.logQueue = [...this.logQueue, logMessage];
    });
  };

  public flush = async (): Promise<void> => {
    for (const message of this.logQueue) {
      await this.writeToFile(message);
    }
  };

  private createLogMessage = (tag: string, message: string, options?: ILogOptions): ILogMessage => {
    return {
      timestamp: Date.now(),
      message: `${tag}: ${message}`,
      payload: {
        ...(options || {}),
      },
    };
  };

  private writeToFile = (message: ILogMessage): Promise<void> => {
    const jsonStringMessage: string = JSON.stringify(message);

    if (!this.writeStream) {
      return Promise.reject(new Error('Write stream is not opened yet.'));
    }

    return this.writeStream?.write(`${jsonStringMessage}\n`);
  };

  private createWriteStream = (): Promise<ReactNativeBlobUtilWriteStream> => {
    if (!RNFetchBlob.fs.exists(this.destination)) {
      return RNFetchBlob.fs.writeFile(this.destination, '', 'utf8')
        .then(() => this.createWriteStream());
    }

    return RNFetchBlob.fs.writeStream(this.destination, 'utf8');
  };
}
