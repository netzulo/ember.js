import {
  get,
  set,
  setHasViews
} from '../..';
import { moduleFor, AbstractTestCase } from 'internal-test-helpers';

import { createTracked } from './support';

moduleFor('tracked set', class extends AbstractTestCase {
  teardown() {
    setHasViews(() => false);
  }

  ['@test should set arbitrary properties on an object'](assert) {
    let obj = createTracked({
      string: 'string',
      number: 23,
      boolTrue: true,
      boolFalse: false,
      nullValue: null,
      undefinedValue: undefined
    });

    let newObj = createTracked({
      undefinedValue: 'emberjs'
    });

    for (let key in obj) {
      assert.equal(set(newObj, key, obj[key]), obj[key], 'should return value');
      assert.equal(get(newObj, key), obj[key], 'should set value');
    }
  }

  ['@test should set a number key on an object'](assert) {
    let obj = createTracked({ 1: 'original' });

    set(obj, 1, 'first');
    assert.equal(obj[1], 'first');
  }
});

