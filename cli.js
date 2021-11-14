#!/usr/bin/env node
const inquirer = require('inquirer');
const path = require('path');
const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');
const memFs = require('mem-fs');
const memFsEditor = require('mem-fs-editor');
const argv = require('minimist')(process.argv.slice(2));
const questions = require('./questions');
const mfsEditor = memFsEditor.create(memFs.create());

class WebComponentsCLI {
  constructor() {
    this.root = path.resolve(__dirname, './');
    this.src = path.resolve(__dirname, './cva-boilerplate');
    this.dest = ''
    this.log = console.log;
  }

  showLogo() {
    clear();
    this.log(
      chalk.yellow(
        figlet.textSync('Create Vanilla App', {
          horizontalLayout: 'default',
          verticalLayout: 'default'
        })
      )
    );
  }

  showInfo(message) {
    this.log(chalk.blue(`[CVA CLI] Info: ${message}`));
  }

  showSuccess(message) {
    this.log(chalk.green(`[CVA CLI] Success: ${message}`));
  }

  showError(message) {
    this.log(chalk.red(`[CVA CLI] Error: ${message}`));
  }

  copyBoilerplate(projectData) {
    mfsEditor.copy(
      `${this.root}/gitignore`,
      `${this.dest}/.gitignore`
    );
    mfsEditor.copyTpl(
      `${this.src}`,
      `${this.dest}`,
      projectData
    );
  }

  async createProject() {
    const name = argv['_'][0];
    this.dest = path.resolve(name);

    await this.showLogo();
    
    const anwsers = await inquirer.prompt(questions);

    this.copyBoilerplate({name, ...anwsers});

    mfsEditor.commit(() => {
      process.chdir(this.dest);
      this.showSuccess(`${name} project has been successfully created!`);
      this.showInfo('First run npm install then, to launch the application just type npm start');
    });
  }

  load() {
    if (argv['_'].length > 0) {
      this.createProject();
    } else {
      this.showError('Type the name of your application!');
    }
  }
}

new WebComponentsCLI().load();
