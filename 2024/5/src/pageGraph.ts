import { Page } from "./page.ts";

export class PageGraph {
  readonly pages: Page[];

  private constructor() {
    this.pages = [];
  }

  private getPage(pageNum: number): Page {
    const page = this.pages.find((page) => page.pageNum === pageNum);
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
        fromPage.addEdgeTo(toPage);
      });

    return pageGraph;
  }
}
