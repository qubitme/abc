import { angularInitGenerator, applicationGenerator } from '@nrwl/angular/generators';
import { Schema as AngularApplicationOptions } from '@nrwl/angular/src/generators/application/schema';
import { Schema as AngularInitOptions } from '@nrwl/angular/src/generators/init/schema';
import { addDependenciesToPackageJson, ensurePackage, formatFiles, GeneratorCallback, names, Tree } from '@nrwl/devkit';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import * as VERSIONS from '../../utils/versions';
import { ApplicationGeneratorSchema as ApplicationGeneratorOptions, NgAddOptions, NormalizedOptions } from './schema';
// import { Schema as NgAddOptions } from '@angular/material/schematics/ng-add';
// src/material/schematics/ng-add



function normalizeOptions(tree: Tree, options: ApplicationGeneratorOptions): NormalizedOptions {
  const { applicationName, } = options;

  const appName = names(applicationName).fileName;

  return { appName, };
}

export default async function (tree: Tree, options: ApplicationGeneratorOptions) {
  const { appName, } = normalizeOptions(tree, options);

  const type = 'feat';
  const style = 'scss';

  const tasks: GeneratorCallback[] = [];

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

  const qAppGenerator = await applicationGenerator(tree, angularAppOptions);
  tasks.push(qAppGenerator);

  ensurePackage('@angular/material', VERSIONS.ANGULAR_MATERIAL);
  ensurePackage('@angular/cdk', VERSIONS.ANGULAR_CDK);

  const installTask = addDependenciesToPackageJson(tree, {
    '@angular/material': VERSIONS.ANGULAR_MATERIAL,
    '@angular/cdk': VERSIONS.ANGULAR_CDK,
  }, {});

  const ngAddMaterialGenerator = wrapAngularDevkitSchematic('@angular/material', 'ng-add');

  const ngAddOptions: NgAddOptions = { project: appName, animations: 'enabled', theme: 'indigo-pink', typography: true };

  await ngAddMaterialGenerator(tree, ngAddOptions);
  await formatFiles(tree);
  return installTask;
}
