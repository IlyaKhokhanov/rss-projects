import News from './news/News';
import Sources from './sources/Sources';

export class AppView {
  constructor() {
    this.news = News;
    this.sources = Sources;
  }

  drawNews(data) {
    const values = data?.articles ? data?.articles : [];
    this.news.draw(values);
  }

  drawSources(data) {
    const values = data?.sources ? data?.sources : [];
    this.sources.draw(values);
  }
}

export default AppView;
