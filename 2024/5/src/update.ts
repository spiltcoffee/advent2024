import { Page } from "./page.ts";
import { PageGraph } from "./pageGraph.ts";

export class Update {
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
