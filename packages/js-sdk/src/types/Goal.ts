/*!
 * Convert JS SDK
 * Version 1.0.0
 * Copyright(c) 2020 Convert Insights, Inc
 * License Apache-2.0
 */
import {RuleSet} from './Rule';
import {Id} from './Id';

export type Goal = {
  id: Id;
  rules?: RuleSet;
  name: string;
  key: string;
};
