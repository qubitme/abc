import { formatFiles, logger, names, Tree } from '@nrwl/devkit';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import { NgAddOptions, NormalizedOptions, MaterialGeneratorSchema } from './schema';


function normalizeOptions(tree: Tree, options: MaterialGeneratorSchema): NormalizedOptions {
  const appName = names(options.applicationName).fileName;

  return { appName, };
}

export default async function (tree: Tree, options: MaterialGeneratorSchema) {
  const { appName } = normalizeOptions(tree, options);

  const ngAddOptions: NgAddOptions = { project: appName, animations: 'enabled', theme: 'indigo-pink', typography: true };

  const ngAddMaterialGenerator = wrapAngularDevkitSchematic('@angular/material', 'ng-add');

  logger.log('ngAddMaterialGenerator: ', ngAddMaterialGenerator);

  await ngAddMaterialGenerator(tree, ngAddOptions);

  await formatFiles(tree);

  return () => {
    logger.info(`Nx Qmaterial Generator: ${appName} has been generated.`);
  }
}
