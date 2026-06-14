declare module 'yt-search' {
  interface YtVideo {
    videoId: string;
    title: string;
    seconds?: number;
  }

  interface YtSearchResult {
    videos: YtVideo[];
  }

  function yts(query: string): Promise<YtSearchResult>;
  export default yts;
}
