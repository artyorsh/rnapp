import { Platform } from 'react-native';
import Config from 'react-native-config';
import RNDeviceInfo from 'react-native-device-info';
import { ContainerModule } from 'inversify';

import { LogService } from '../service/log/log.service';
import { ILogService } from '../service/log/model';
import { ConsoleLogTransporter } from '../service/log/transporters/console-log-transporter';
import { FileLogTransporter } from '../service/log/transporters/file-log-transporter';
import { GrafanaLogTransporter } from '../service/log/transporters/grafana-log-transporter';
import { INavigationService } from '../service/navigation/model';
import { NavigationService } from '../service/navigation/navigation.service';
import { LocalAuthenticationProvider } from '../service/session/local-auth-provider';
import { MMKVAuthenticationStorage } from '../service/session/mmkv-auth-storage';
import { ISessionService } from '../service/session/model';
import { SessionService } from '../service/session/session.service';
import { IUserService } from '../service/user/model';
import { UserService } from '../service/user/user.service';
import { UserApi } from '../service/user/user-api';
import { AppModule } from './container';

export const createModules = (): ContainerModule[] => {

  const mainModule = new ContainerModule(bind => {
    const grafanaAppId: string = `rnapp_${Platform.OS}_${Config.RNAPP_ENV_NAME}`;

    const deviceName: string = RNDeviceInfo.getDeviceNameSync();
    const deviceModel: string = RNDeviceInfo.getModel();
    const deviceBrand: string = RNDeviceInfo.getBrand();
    const systemVersion: string = RNDeviceInfo.getSystemVersion();
    const appVersion: string = RNDeviceInfo.getVersion();

    const logService = new LogService({
      defaultLabels: {
        app: grafanaAppId,
        version: appVersion,
        runtime: `${deviceName}/${Platform.OS}/${systemVersion}/${deviceBrand}/${deviceModel}`,
      },
      transporters: [
        new ConsoleLogTransporter(),
        new FileLogTransporter('app.log'),
        new GrafanaLogTransporter({
          hostUrl: Config.RNAPP_GRAFANA_HOST || '',
        }),
      ],
    });

    bind<INavigationService>(AppModule.NAVIGATION).toConstantValue(new NavigationService(logService));

    bind<ILogService>(AppModule.LOG).toConstantValue(logService);

    const sessionService: ISessionService = new SessionService({
      tokenRefreshThresholdMinutes: Number(Config.RNAPP_AUTH_TOKEN_REFRESH_THRESHOLD_MINUTES) || 0,
      authenticationProvider: new LocalAuthenticationProvider(),
      authenticationStorage: new MMKVAuthenticationStorage({
        encryptionKey: Config.RNAPP_STORAGE_ENCRYPTION_KEY || '',
      }),
      logger: logService,
    });

    bind<ISessionService>(AppModule.SESSION).toConstantValue(sessionService);

    bind<IUserService>(AppModule.USER).toConstantValue(new UserService({
      sessionService,
      userRepository: new UserApi(),
      logger: logService,
    }));
  });

  return [mainModule];
};
