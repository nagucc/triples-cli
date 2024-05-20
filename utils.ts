import axios from 'axios';
export const PREFIX = {
  cli: 'http://ontology.nagu.cc/triples-cil#',
}

export const RESOURCE = {
  AbbreviatedAs: `${PREFIX.cli}abbreviatedAs`,
}

export const apiHost = 'https://10-10-160-92-13001.webvpn.ynu.edu.cn';
export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidHJpcGxlcy1jbGkifQ.fA5VitToxbmcK6DMSDJ1iGST73LyLPO5XrXqnnw-IiU';

export class Property {
  public iri: string;
  constructor(iri: string) {
    this.iri = iri;
  }
  async listByO(object: string) {
    const url = `${apiHost}/v1/predicate/${encodeURIComponent(this.iri)}/object/${encodeURIComponent(object)}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data || [];
  }
  async getByO(object: string) {
    return this.listByO(object)[0];
  }
  async list() {
    const url = `${apiHost}/v1/predicate/${encodeURIComponent(this.iri)}`;
    // console.log(`Property.list from: ${url}`);
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data || [];
  }
  /**
   * 添加断言
   * @param subject 主体
   * @param object 客体
   */
  async assert(subject: string, object: string) {
    const res = await axios.put(`${apiHost}/v1/triple/`, {
      subject,
      predicate: this.iri,
      object,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json',
      },
    });
    return res.data.data;
  }
}

export const Factory = {
  createProperty: async (name: string) => {
    // 1. 检查iri是否是缩写，如果是，则转换为完整形式
    let iri = name;
    const isNameAbbreviated = !/[A-Za-z]:\/\//.test(name);
    if (isNameAbbreviated) {
      // 需要将缩写改为完整形式
      const abbreviatedAsProperty = new Property(RESOURCE.AbbreviatedAs);
      iri = await abbreviatedAsProperty.getByO(name.split(":")[0]);
    }
    // 2. 创建Property实例
    return new Property(iri);
  }
}