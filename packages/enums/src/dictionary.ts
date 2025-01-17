/*!
 * Convert JS SDK
 * Version 1.0.0
 * Copyright(c) 2020 Convert Insights, Inc
 * License Apache-2.0
 */
export const ERROR_MESSAGES = {
  SDK_KEY_MISSING: 'SDK key is missing',
  DATA_OBJECT_MISSING: 'Data object is missing',
  CONFIG_DATA_NOT_VALID: 'Config Data is not valid',
  SDK_OR_DATA_OBJECT_REQUIRED: 'SDK key or Data object should be provided',
  RULE_NOT_VALID: 'Provided rule is not valid',
  RULE_DATA_NOT_VALID: 'Provided rule data is not valid',
  RULE_ERROR: 'Rule error',
  DATA_STORE_NOT_VALID:
    'DataStore object is not valid. It should contain get and set methods',
  VISITOR_ID_REQUIRED: 'Visitor Id string is not present',
  GOAL_DATA_NOT_VALID: 'GoalData object is not valid',
  UNABLE_TO_SELECT_BUCKET_FOR_VISITOR: 'Unable to bucket visitor',
  UNABLE_TO_PERFORM_NETWORK_REQUEST: 'Unable to perform network request',
  UNSUPPORTED_RESPONSE_TYPE: 'Unsupported response type'
};
export const MESSAGES = {
  CONFIG_DATA_UPDATED: 'Config Data updated',
  CORE_CONSTRUCTOR: 'Core Manager constructor has been called',
  CORE_INITIALIZED: 'Core Manager has been initialized',
  EXPERIENCE_CONSTRUCTOR: 'Experience Manager constructor has been called',
  EXPERIENCE_NOT_FOUND: 'Experience not found',
  EXPERIENCE_RULES_MATCHED: 'Experience rules matched',
  VARIATIONS_NOT_FOUND: 'Variations not found',
  VARIATION_CHANGE_NOT_SUPPORTED: 'Variation change not supported',
  FEATURE_CONSTRUCTOR: 'Feature Manager constructor has been called',
  FEATURE_NOT_FOUND: 'Fullstack Feature not found',
  FEATURE_VARIABLES_NOT_FOUND: 'Fullstack Feature Variables not found',
  FEATURE_VARIABLES_TYPE_NOT_FOUND:
    'Fullstack Feature Variables Type not found',
  BUCKETING_CONSTRUCTOR: 'Bucketing Manager constructor has been called',
  DATA_CONSTRUCTOR: 'Data Manager constructor has been called',
  RULE_CONSTRUCTOR: 'Rule Manager constructor has been called',
  PROCESSING_ENTITY: 'Processing #',
  LOCATION_MATCH: 'Location # rule matched',
  LOCATION_NOT_MATCH: 'Location does not match',
  AUDIENCE_MATCH: 'Audience # rule matched',
  AUDIENCE_NOT_MATCH: 'Audience does not match',
  AUDIENCE_NOT_RESTRICTED: 'Audience not restricted',
  SEGMENTATION_MATCH: 'Segmentation # rule matched',
  RULE_NOT_MATCH: 'Rule does not match',
  RULE_MATCH: 'Found matched rule at OR block #',
  RULE_MATCH_AND: 'AND block rule macthed',
  RULE_MATCH_START: 'About to evaluate rule #',
  LOCATION_ACTIVATED: 'Location # activated',
  LOCATION_DEACTIVATED: 'Location # deactivated',
  BUCKETED_VISITOR_FOUND: 'Visitor is already bucketed for variation #',
  BUCKETED_VISITOR: 'Visitor is bucketed for variation #',
  GOAL_NOT_FOUND: 'Goal not found',
  GOAL_RULE_NOT_MATCH: 'Goal rule do not match',
  GOAL_FOUND: 'Goal # already triggered',
  SEGMENTS_NOT_FOUND: 'Segments not found',
  SEGMENTS_RULE_NOT_MATCH: 'Segments rule do not match',
  CUSTOM_SEGMENTS_KEY_FOUND: 'Custom segments key already set',
  SEND_BEACON_SUCCESS:
    'The user agent successfully queued the data for transfer'
};
