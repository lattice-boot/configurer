import { rootContainer } from '@lattice/core';

import { ConfigField, Configurer } from '../decorator';
import { OptionGetterProvider } from '../option.getter.provider';

describe('Configurer decorator test', () => {
  const getterProviderFake: any = {
    generateOptionGetter: (targetSrc: string, defaultValue: any) => {
      return () => ({
        targetSrc,
        defaultValue,
      });
    }
  };

  beforeAll(() => {
    rootContainer.unbind(OptionGetterProvider);
    rootContainer.bind(OptionGetterProvider).toConstantValue(getterProviderFake);
  });

  it('should not throw when config not field', () => {
    @Configurer('test.add')
    class TestConfig { }
    const testInstance = rootContainer.get(TestConfig);
    expect(testInstance).toBeTruthy();
  });

  it('should cover getter and setter on params', () => {
    @Configurer('test.add')
    class TestConfig {
      @ConfigField('field1', 233)
      field1!: number;
      @ConfigField('field2', 244)
      field2!: number;
      @ConfigField()
      field3!: number;
    }

    const testInstance = rootContainer.get(TestConfig);
    expect(testInstance.field1).toEqual({
      targetSrc: 'test.add.field1',
      defaultValue: 233
    });
    expect(testInstance.field3).toEqual({
      targetSrc: 'test.add.field3',
      defaultValue: undefined
    });
  });
});