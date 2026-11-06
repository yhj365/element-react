/** 文档数据边界；避免从完整生成 JSON 推导数千项联合类型。 */
export interface ApiDoc {
  id: string;
  section: string;
  sourceName: string;
  reactName: string;
  description: string;
  type: string;
  defaultValue: string;
  sourcePath: string;
  sourceLine: number;
  tests?: { file: string; title: string; example: string }[];
}
export interface ExampleDoc {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  code: string;
}
export interface ComponentDoc {
  id: string;
  title: string;
  category: string;
  description: string;
  implementation: string;
  api: ApiDoc[];
  examples: ExampleDoc[];
  features: { id: string; title: string }[];
}
export interface DocCatalog {
  components: ComponentDoc[];
  status: {
    baseline: string;
    fingerprint: string;
    documentedComponents: number;
    completedApi: number;
    completedExamples: number;
    unitTests: number;
    totalApi: number;
  };
}
