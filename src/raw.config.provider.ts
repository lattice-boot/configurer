import * as fs from 'fs';
import * as yaml from 'js-yaml';

import { Injectable } from '@lattice/core';

@Injectable(RawConfigProvider, 'root')
export class RawConfigProvider {
  protected raw: any;
  private loadedConfig: string[] = [];

  get rawConfig() {
    if (!this.raw) {
      this.loadFile('env/application.yml');
      this.loadChilds();
    }
    return this.raw;
  }

  private get configFiles() {
    try {
      return this.raw.lattice.configurer.files || [];
    } catch {
      return [];
    }
  }

  private loadChilds() {
    const configFiles = this.configFiles;
    for (const file of configFiles) {
      this.loadFile(file);
      if (this.configFiles !== configFiles) {
        this.loadChilds();
      }
    }
  }

  private loadFile(filename: string) {
    if (this.loadedConfig.includes(filename)) return;
    this.loadedConfig.push(filename);
    const configContent = fs.readFileSync(filename, 'utf8');
    this.raw = this.raw || {};
    this.raw = {
      ...this.raw,
      ...yaml.safeLoad(configContent),
    };
  }
}