import 'mocha';
import {expect} from 'chai';
import {assert} from 'chai';

import {DataStoreManager as dsm} from '../src/data-store-manager';
import testConfig from './test-config.json';
import {Config} from '@mattddean-oss/convertcom-js-sdk-types';

const configuration = testConfig as unknown as Config;

describe('DataStoreManager tests', function () {
  it('Should expose DataStoreManager', function () {
    assert.isDefined(dsm);
  });
  it('Imported entity should be a constructor of DataStoreManager instance', function () {
    expect(dsm)
      .to.be.a('function')
      .that.has.property('name')
      .which.equal('DataStoreManager');
  });
});
