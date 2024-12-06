import { AnswerFunction } from "../../answer.ts";

class Page {
  readonly pageNum: number;
  readonly to: Set<Page>;

  constructor(pageNum: number) {
    this.pageNum = pageNum;
    this.to = new Set<Page>();
  }

  addEdgeTo(page: Page): void {
    this.to.add(page);
  }

  hasEdgeTo(page: Page): boolean {
    return this.to.has(page);
  }

  hasEdgesTo(pages: Page[]): boolean {
    return pages.every((page) => this.hasEdgeTo(page));
  }
}

class PageGraph {
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

class Update {
  readonly pages: Page[];

  private constructor(pages: Page[]) {
    this.pages = pages;
  }

  private isPagesValid(pages: Page[]): boolean {
    return pages.every((page, index) =>
      page.hasEdgesTo(pages.slice(index + 1))
    );
  }

  get middlePage(): Page {
    return this.pages[Math.floor(this.pages.length / 2)];
  }

  isValid(): boolean {
    return this.isPagesValid(this.pages);
  }

  fixUpdate(): Update {
    const fixedPages = [];
    const pagesToCheck = [...this.pages];
    while (pagesToCheck.length) {
      const page = pagesToCheck.shift();
      (page.hasEdgesTo(pagesToCheck) ? fixedPages : pagesToCheck).push(page);
    }

    return new Update(fixedPages);
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

  const { validUpdates, invalidUpdates } = updates
    .split("\n")
    .map((updateStr) => Update.parseUpdate(updateStr, pageGraph))
    .reduce<{ validUpdates: Update[]; invalidUpdates: Update[] }>(
      ({ validUpdates, invalidUpdates }, update) => {
        (update.isValid() ? validUpdates : invalidUpdates).push(update);
        return { validUpdates, invalidUpdates };
      },
      { validUpdates: [], invalidUpdates: [] }
    );

  const validUpdatesMidPageTotal = validUpdates.reduce(
    (total, update) => total + update.middlePage.pageNum,
    0
  );

  const invalidUpdatesMidPageTotal = invalidUpdates
    .map((update) => update.fixUpdate())
    .reduce((total, update) => total + update.middlePage?.pageNum, 0);

  return [
    validUpdatesMidPageTotal.toString(),
    invalidUpdatesMidPageTotal.toString()
  ];
};
