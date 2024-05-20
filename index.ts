import select from '@inquirer/select';

const answer = await select({
  message: '选择功能:',
  choices: [{
    name: '1. Prefix管理',
    value:'./prefix/index.js',
    description: '',
  }, {
    name: '9. 初始化',
    value:'./prefix/index.js',
    description: '',
  }],
});

await import(answer);