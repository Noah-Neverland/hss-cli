import { select, input } from '@inquirer/prompts';
import os from 'node:os';
import { NpmPackage } from '@hanss-cli/utils';
import path from 'node:path';
import ora from 'ora';
import fse from 'fs-extra';

async function create() {
  const projectTemplate = await select({
    message: '请选择项目模版',
    choices: [
      {
        name: 'react 项目',
        value: '@hanss-cli/template-react'
      },
      {
        name: 'vue 项目',
        value: '@hanss-cli/template-vue'
      }
    ],
  });

  let projectName = '';
  while (!projectName) {
    projectName = await input({ message: '请输入项目名' });
  }

  const pkg = new NpmPackage({
    name: projectTemplate,
    targetPath: path.join(os.homedir(), '.hanss-cli-template')
  })

  if (!await pkg.exists()) {
    const spinner = ora('下载模版中...').start();
    await pkg.install();
    spinner.stop();
  } else {
    const spinner = ora('更新模版中...').start();
    await pkg.update();
    spinner.stop();
  }

  const spinner = ora('创建项目中...').start();
  const templatePath = path.join(pkg.npmFilePath, 'template');
  const targetPath = path.join(process.cwd(), projectName);
  fse.copySync(templatePath, targetPath);
  spinner.stop();
}

create();

export default create;
