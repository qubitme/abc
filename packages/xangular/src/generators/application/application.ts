import { angularInitGenerator, applicationGenerator } from '@nrwl/angular/generators';
import { Schema as AngularApplicationOptions } from '@nrwl/angular/src/generators/application/schema';
import { Schema as AngularInitOptions } from '@nrwl/angular/src/generators/init/schema';
import { addDependenciesToPackageJson, formatFiles, names, Tree } from '@nrwl/devkit';
import * as VERSIONS from '../../utils/versions';
import { ApplicationGeneratorSchema as ApplicationGeneratorOptions, NormalizedOptions } from './schema';


function normalizeOptions(tree: Tree, options: ApplicationGeneratorOptions): NormalizedOptions {
  const { applicationName, } = options;

  const appName = names(applicationName).fileName;

  return { appName, };
}

export default async function (tree: Tree, options: ApplicationGeneratorOptions) {
  const { appName, } = normalizeOptions(tree, options);

  const type = 'feat';
  const style = 'scss';

  const angularInitOptions: AngularInitOptions = {
    ...options,
    style,
  };
  await angularInitGenerator(tree, angularInitOptions);

  const angularAppOptions: AngularApplicationOptions = {
    ...options,
    name: appName,
    tags: `scope:${appName},type:${type}`,
    inlineTemplate: true,
    prefix: appName,
    style,
    minimal: true,
  };

  await applicationGenerator(tree, angularAppOptions);

  const addDepsToTargetWorkspace = addDependenciesToPackageJson(tree, {
    '@angular/material': VERSIONS.ANGULAR_MATERIAL,
    '@angular/cdk': VERSIONS.ANGULAR_CDK,
  }, {});

  await formatFiles(tree);

  return addDepsToTargetWorkspace;
}
