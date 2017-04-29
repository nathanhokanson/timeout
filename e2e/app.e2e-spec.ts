import { TimeoutPage } from './app.po';

describe('timeout App', () => {
  let page: TimeoutPage;

  beforeEach(() => {
    page = new TimeoutPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
