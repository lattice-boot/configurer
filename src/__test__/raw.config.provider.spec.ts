import mock from 'mock-fs';

import { RawConfigProvider } from '../raw.config.provider';

describe('RawConfigProvider test', () => {

  it('should be load yml config', () => {
    mock({
      'env/application.yml': `
      default:
        host: "localhost"
        port: 3306
        username: "test"
        password: "test"
        database: "test"
      `,
    });
    const rawConfig = new RawConfigProvider();
    const raw = rawConfig.rawConfig;
    mock.restore();
    expect(raw).toEqual({
      default:
      {
        host: 'localhost',
        port: 3306,
        username: 'test',
        password: 'test',
        database: 'test'
      }
    });
  });

  it('should not repeat load files', () => {
    mock({
      'env/application.yml': `
      lattice:
        configurer:
          files:
      default:
        host: "localhost"
        port: 3306
        username: "test"
        password: "test"
        database: "test"
      `,
    });
    const rawConfig = new RawConfigProvider();
    const raw1 = rawConfig.rawConfig;
    const raw2 = rawConfig.rawConfig;
    mock.restore();
    expect(raw1).toBe(raw2);
  });

  it('should be load child with lattice.configurer.files', () => {
    mock({
      'env/application.yml': `
      lattice:
        configurer:
          files:
            - env/application-child.yml
      `,
      'env/application-child.yml': `
      default:
        host: "localhost"
        port: 3306
        username: "test"
        password: "test"
        database: "test"
      `,
    });
    const rawConfig = new RawConfigProvider();
    const raw = rawConfig.rawConfig;
    mock.restore();
    expect(raw).toEqual({
      lattice: { configurer: { files: ['env/application-child.yml'] } },
      default: {
        host: 'localhost',
        port: 3306,
        username: 'test',
        password: 'test',
        database: 'test'
      }
    });
  });

  it('should be deep import config', () => {
    mock({
      'env/application.yml': `
      lattice:
        configurer:
          files:
            - env/application-first.yml
      `,
      'env/application-first.yml': `
      lattice:
        configurer:
          files:
            - env/application-second.yml
      `,
      'env/application-second.yml': `
      test: 233
      `,
    });
    const rawConfig = new RawConfigProvider();
    const raw = rawConfig.rawConfig;
    mock.restore();
    expect(raw).toEqual({
      lattice: { configurer: { files: ['env/application-second.yml'] } },
      "test": 233,
    });
  });

  it('should cycle import config', () => {
    mock({
      'env/application.yml': `
      lattice:
        configurer:
          files:
            - env/application-first.yml
      `,
      'env/application-first.yml': `
      lattice:
        configurer:
          files:
            - env/application-second.yml
      `,
      'env/application-second.yml': `
      lattice:
        configurer:
          files:
            - env/application-first.yml
      test: 233
      `,
    });
    const rawConfig = new RawConfigProvider();
    const raw = rawConfig.rawConfig;
    mock.restore();
    expect(raw).toEqual({
      lattice: { configurer: { files: ['env/application-first.yml'] } },
      "test": 233,
    });
  });
});
