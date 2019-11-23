import { Injectable } from '@lattice/core';

import { RawConfigProvider } from './raw.config.provider';

@Injectable(OptionGetterProvider, 'root')
export class OptionGetterProvider {
  constructor(
    private rawConfig: RawConfigProvider,
  ) { }

  generateOptionGetter(index: string, defaultVal: any) {
    const indexSet = index.split('.');
    return () => {
      return indexSet.reduce((target, origin) => {
        if (target == undefined || target == null)
          return null;
        else
          return target[origin];
      }, this.rawConfig.rawConfig) || defaultVal;
    };
  }
}