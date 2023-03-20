export interface LibraryGeneratorOptions {
  applicationScope: string;
  libraryScope: string;
  libraryType: string;
  libraryName: string;
  addRouting?: boolean;
  routableAt?: string;
  skipModule?: boolean;
  alsoCreateComponent?: boolean;
}

export enum LibType {
  Feature = 'feature', // TODO: is every feature routable?
  Ui = 'ui',
  Dacc = 'dacc',
  Util = 'util',
  Shell = 'shell',
}

export type CssStyle = 'scss' | 'css' | 'sass' | 'less' | 'none';

export interface ComponentGeneratorOptions {
  componentName: string;
  projectName: string;
  libraryType: string;
}