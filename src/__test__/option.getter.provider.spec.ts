import { OptionGetterProvider } from '../option.getter.provider';

describe('OptionGetterProvider test', () => {
  let optionGetter: OptionGetterProvider;
  let rawConfigFake: any = {};

  beforeAll(() => {
    optionGetter = new OptionGetterProvider(rawConfigFake);
  });

  it('should generator getter with path', () => {
    const getter = optionGetter.generateOptionGetter('test', null);
    expect(getter).toBeInstanceOf(Function);
  });

  it('should getter config and return it', () => {
    rawConfigFake.rawConfig = { test: { hehe: '233' } };
    const getter = optionGetter.generateOptionGetter('test.hehe', 123);
    expect(getter()).toBe('233');
  });

  it('should getter undefined config and return defaultVal', () => {
    rawConfigFake.rawConfig = {};
    const getter = optionGetter.generateOptionGetter('test.hehe', 123);
    expect(getter()).toBe(123);
  });
});