import { select, input } from '@inquirer/prompts';
import { Factory, RESOURCE } from '../utils.js';

let abbreviatedAsProperty;
const main = async () => {
  // 1. 获取所有做了前缀缩写的IRI
  if (!abbreviatedAsProperty) abbreviatedAsProperty = await Factory.createProperty(RESOURCE.AbbreviatedAs);
  const triples = await abbreviatedAsProperty.list();
  const answer = await select({
    message: '选择功能:',
    choices: [
      {
        name: '添加Prefix',
        value: {},
        description: '',
      },
      ...triples.map(t => ({
        name: `${t.object.name} -> ${t.subject.name}`,
        value: t,
      })),
    ],
  });
  if (!answer.id) {
    // 添加prefix
    await addPrefix();
    main();
  } else {

  }
  console.log('-------------------------------------------');
}
const addPrefix = async () => {
  const msg = await input({
    message: '请输入前缀和完整IRI(格式：prefix,iri)：'
  });
  const [prefix, iri] = msg.split(',').map(s => s.trim());
  if (prefix && iri) {
    await abbreviatedAsProperty.assert(iri, prefix);
  } else console.log('prefix 或者 iri 不完整，无法添加');
}

main();
