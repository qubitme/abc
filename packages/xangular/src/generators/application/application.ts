import { angularInitGenerator, applicationGenerator } from '@nrwl/angular/generators';
import { Schema as AngularApplicationOptions } from '@nrwl/angular/src/generators/application/schema';
import { Schema as AngularInitOptions } from '@nrwl/angular/src/generators/init/schema';
import { addDependenciesToPackageJson, formatFiles, GeneratorCallback, installPackagesTask, logger, names, Tree } from '@nrwl/devkit';
import { ApplicationGeneratorSchema as ApplicationGeneratorOptions, NgAddOptions, NormalizedOptions } from './schema';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import * as VERSIONS from '../../utils/versions';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
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

  const addDeps = addDependenciesToPackageJson(tree, {
    '@angular/material': VERSIONS.ANGULAR_MATERIAL,
    '@angular/cdk': VERSIONS.ANGULAR_CDK,
  }, {});
  tasks.push(addDeps);

  tasks.push(async () => await installPackagesTask(tree));

  const ngAddMaterialGenerator = wrapAngularDevkitSchematic('@angular/material', 'ng-add');
  const ngAddOptions: NgAddOptions = { project: appName, animations: 'enabled', theme: 'indigo-pink', typography: true };
  logger.log('ngAddOptions', ngAddOptions);
  tasks.push(async () => await ngAddMaterialGenerator(tree, ngAddOptions));

  tasks.push(async () => await formatFiles(tree));

  return runTasksInSerial(...tasks);
}
