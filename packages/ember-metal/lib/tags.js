import { CONSTANT_TAG, UpdatableTag, CURRENT_TAG } from '@glimmer/reference';
import { meta as metaFor } from './meta';
import run from './run_loop';

let hasViews = () => false;

export function setHasViews(fn) {
  hasViews = fn;
}

function makeTag() {
  return UpdatableTag.create();
}

export function tagForProperty(object, propertyKey, _meta) {
  if (typeof object !== 'object' || object === null) { return CONSTANT_TAG; }

  let meta = _meta === undefined ? metaFor(object) : _meta;
  if (meta.isProxy()) {
    return tagFor(object, meta);
  }

  let tags = meta.writableTags();
  let tag = tags[propertyKey];
  if (tag) { return tag; }

  return tags[propertyKey] = makeTag();
}

export function tagFor(object, _meta) {
  if (typeof object === 'object' && object !== null) {
    let meta = _meta === undefined ? metaFor(object) : _meta;
    return meta.writableTag(makeTag);
  } else {
    return CONSTANT_TAG;
  }
}

export function markObjectAsDirty(meta, propertyKey) {
  let objectTag = meta.readableTag();

  if (objectTag !== undefined) {
    if (meta.isProxy()) {
      objectTag.inner.first.inner.update(CURRENT_TAG);
    } else {
      objectTag.inner.update(CURRENT_TAG);
    }
  }

  let tags = meta.readableTags();
  let propertyTag = tags !== undefined ? tags[propertyKey] : undefined;

  if (propertyTag !== undefined) {
    propertyTag.inner.update(CURRENT_TAG);
  }

  if (objectTag !== undefined || propertyTag !== undefined) {
    ensureRunloop();
  }
}

let backburner;
function ensureRunloop() {
  if (backburner === undefined) {
    backburner = run.backburner;
  }

  if (hasViews()) {
    backburner.ensureInstance();
  }
}
