import 'reflect-metadata';

import { injectable } from 'inversify';

import { rootContainer } from '@lattice/core';

import { OptionGetterProvider } from './option.getter.provider';

const CONFIGURER_META_LIST = '__configurer_meta_list__'

export function Configurer(src: string, serviceIdentifier?: any) {
  return <T extends { new(...args: any[]): {} }>(constructor: T) => {
    const targetContainer = rootContainer;
    const target = injectable()(constructor);
    const metaList: any[] = Reflect.getMetadata(CONFIGURER_META_LIST, target) || [];
    const getterProvider = targetContainer.get(OptionGetterProvider);
    for (const meta of metaList) {
      const targetSrc = [src, meta.src].join('.');
      target.prototype.__defineGetter__(meta.targetKey, getterProvider.generateOptionGetter(targetSrc, meta.defaultValue));
    }
    targetContainer.bind(serviceIdentifier || target).to(target).inSingletonScope();
    return target;
  }
}

export function ConfigField(src?: string, defaultValue?: any) {
  return (target: any, targetKey: string) => {
    src = src || targetKey;
    const metaList: any[] = Reflect.getMetadata(CONFIGURER_META_LIST, target.constructor) || [];
    metaList.push({ src, defaultValue, targetKey });
    Reflect.defineMetadata(CONFIGURER_META_LIST, metaList, target.constructor);
  }
}
