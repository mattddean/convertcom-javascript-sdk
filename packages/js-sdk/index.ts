/*!
 * Convert JS SDK test
 * Version 1.0.0
 * Copyright(c) 2020 Convert Insights, Inc
 * License Apache-2.0
 */

/**
 * Module dependencies
 */
import {ApiManager} from '@mattddean-oss/convertcom-js-sdk-api';
import {BucketingManager} from '@mattddean-oss/convertcom-js-sdk-bucketing';
import {Core} from './src/core';
import {DataManager} from '@mattddean-oss/convertcom-js-sdk-data';
import {EventManager} from '@mattddean-oss/convertcom-js-sdk-event';
import {ExperienceManager} from '@mattddean-oss/convertcom-js-sdk-experience';
import {FeatureManager} from './src/feature-manager';
import {RuleManager} from '@mattddean-oss/convertcom-js-sdk-rules';
import {SegmentsManager} from '@mattddean-oss/convertcom-js-sdk-segments';
import {LogManager} from '@mattddean-oss/convertcom-js-sdk-logger';

import {Config} from './src/config';
import {ERROR_MESSAGES} from '@mattddean-oss/convertcom-js-sdk-enums';
import {Config as ConfigType} from '@mattddean-oss/convertcom-js-sdk-types';

//todo: add config attributes definition
/**
 * Create new Convert SDK instance
 * @category Main
 * @constructor
 */
class ConvertSDK extends Core {
  /**
   * @param {ConfigType} config
   */
  constructor(config: ConfigType) {
    // Validate config before assigning defaults
    const isValidSDKKey = Boolean(
      Object.prototype.hasOwnProperty.call(config, 'sdkKey') &&
        config.sdkKey?.length
    );
    const isValidData = Boolean(
      Object.prototype.hasOwnProperty.call(config, 'data')
    );
    if (!isValidSDKKey && !isValidData) {
      console.error(ERROR_MESSAGES.SDK_OR_DATA_OBJECT_REQUIRED);
    }

    const configuration = Config(config);
    const loggerManager = new LogManager(
      console,
      configuration.logger.logLevel
    );
    for (const k in configuration.logger.customLoggers) {
      if (
        Object.prototype.hasOwnProperty.call(
          configuration.logger.customLoggers[k],
          'logger'
        ) &&
        Object.prototype.hasOwnProperty.call(
          configuration.logger.customLoggers[k],
          'logLevel'
        )
      ) {
        loggerManager.addClient(
          configuration.logger.customLoggers[k].logger,
          configuration.logger.customLoggers[k].logLevel,
          configuration.logger.customLoggers[k]?.methodsMap
        );
      } else {
        loggerManager.addClient(
          configuration.logger.customLoggers[k],
          configuration.logger.logLevel
        );
      }
    }
    const eventManager = new EventManager(configuration, {
      loggerManager
    });
    const apiManager = new ApiManager(configuration, {
      eventManager,
      loggerManager
    });
    const bucketingManager = new BucketingManager(configuration, {
      loggerManager
    });
    const ruleManager = new RuleManager(configuration, {loggerManager});
    const dataManager = new DataManager(configuration, {
      bucketingManager,
      ruleManager,
      eventManager,
      apiManager,
      loggerManager
    });
    const experienceManager = new ExperienceManager(configuration, {
      dataManager
    });
    const featureManager = new FeatureManager(configuration, {
      dataManager,
      loggerManager
    });
    const segmentsManager = new SegmentsManager(configuration, {
      dataManager,
      ruleManager,
      loggerManager
    });
    super(configuration, {
      dataManager,
      eventManager,
      experienceManager,
      featureManager,
      segmentsManager,
      apiManager,
      loggerManager
    });
  }

  /**
   * Promisified ready event
   * @return {Promise<void>}
   */
  onReady(): Promise<void> {
    return super.onReady();
  }
}

export default ConvertSDK;

export {LogLevel, SystemEvents} from '@mattddean-oss/convertcom-js-sdk-enums';
export {FileLogger, DataStore} from '@mattddean-oss/convertcom-js-sdk-utils';
