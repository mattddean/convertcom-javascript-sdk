/*!
 * Convert JS SDK
 * Version 1.0.0
 * Copyright(c) 2020 Convert Insights, Inc
 * License Apache-2.0
 */

import {
  BucketedFeature,
  BucketedVariation,
  BucketingAttributes,
  ConversionAttributes,
  Id,
  SegmentsAttributes,
  SegmentsData
} from '@convertcom/js-sdk-types';
import {RuleError} from '@convertcom/js-sdk-enums';

export interface ContextInterface {
  runExperience(
    experienceKey: string,
    attributes?: BucketingAttributes
  ): BucketedVariation | RuleError;

  runExperiences(
    attributes?: BucketingAttributes
  ): Array<BucketedVariation | RuleError>;

  runFeature(
    key: string,
    attributes?: BucketingAttributes
  ): BucketedFeature | RuleError | Array<BucketedFeature | RuleError>;

  runFeatures(
    attributes?: BucketingAttributes
  ): Array<BucketedFeature | RuleError>;

  trackConversion(goalKey: Id, attributes?: ConversionAttributes): RuleError;

  setDefaultSegments(segments: SegmentsData): void;

  setCustomSegments(
    segmentKeys: Array<string>,
    attributes?: SegmentsAttributes
  ): RuleError;
}
