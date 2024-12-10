export class Page {
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
