import { AnswerFunction } from "../../answer.ts";

class Page {
  readonly pageNum: number;
  readonly after: Set<Page>;

  constructor(pageNum: number) {
    this.pageNum = pageNum;
    this.after = new Set<Page>();
  }

  addAfter(page: Page) {
    this.after.add(page);
  }

  isUpdateValid(pages: Page[]): boolean {
    const [headPage, ...tailPages] = pages;
    if (!this.after.has(headPage)) {
      return false;
    }

    if (!tailPages.length) {
      return true;
    }

    return headPage.isUpdateValid(tailPages);
  }
}

class PageGraph {
  readonly pages: Page[];

  private constructor() {
    this.pages = [];
  }

  private getPage(pageNum: number): Page {
    const page = this.pages.values().find((page) => page.pageNum === pageNum);
    if (page) {
      return page;
    }

    const newPage = new Page(pageNum);
    this.pages.push(newPage);
    return newPage;
  }

  getPages(pageNums: number[]): Page[] {
    return pageNums.map((pageNum) => this.getPage(pageNum));
  }

  static parsePageRules(pageRules: string): PageGraph {
    const pageGraph = new PageGraph();
    pageRules
      .split("\n")
      .map((rule) =>
        rule.split("|").map((pageNum) => Number.parseInt(pageNum, 10))
      )
      .map((rule) => pageGraph.getPages(rule))
      .forEach(([fromPage, toPage]) => {
        fromPage.addAfter(toPage);
      });

    return pageGraph;
  }
}

class Update {
  readonly pages: Page[];

  private constructor(pages: Page[]) {
    this.pages = pages;
  }

  isValid(): boolean {
    const [headPage, ...tailPages] = this.pages;
    return headPage.isUpdateValid(tailPages);
  }

  getMiddlePage(): Page {
    return this.pages[Math.floor(this.pages.length / 2)];
  }

  static parseUpdate(updateStr: string, pageGraph: PageGraph) {
    const pages = pageGraph.getPages(
      updateStr.split(",").map((pageNum) => Number.parseInt(pageNum, 10))
    );
    return new Update(pages);
  }
}

export const answer: AnswerFunction = ([input]) => {
  const [pageRules, updates] = input
    .split("\n\n")
    .filter(Boolean)
    .map((part) => part.trim());

  const pageGraph = PageGraph.parsePageRules(pageRules);

  const validUpdateMidPageTotal = updates
    .split("\n")
    .map((updateStr) => Update.parseUpdate(updateStr, pageGraph))
    .filter((update) => update.isValid())
    .reduce((total, update) => total + update.getMiddlePage().pageNum, 0);

  return [validUpdateMidPageTotal.toString(), ""];
};
