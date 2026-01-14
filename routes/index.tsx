import { Handlers, PageProps } from "$fresh/server.ts";
import { getAllPosts, ArticleInfo } from "../utils/posts.ts";

// サーバー側でのデータ取得
export const handler: Handlers<ArticleInfo[]> = {
  async GET(_req, ctx) {
    const posts = await getAllPosts(); 
    return ctx.render(posts);       // データを画面に渡す
  },
};

// 画面への表示
export default function Home(props: PageProps<ArticleInfo[]>) {
  const posts = props.data; // handlerから渡されたデータを受け取る

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <div class="mb-4 p-4 border rounded text-xl">
        <h1 class="text-2xl font-bold mb-1">このブログについて</h1>
        <p>普段の生活でブログ書きたいなあと思うことが頻繁にあるのですが、
          noteみたいな大きいサービスで公開したいとは思わないし、公開できるような文章力もないということで、
          細々とやっていくためにあります　それ以上もそれ以下もありません</p>
      </div>
      <div class="p-4 border rounded text-xl">
        <h1 class="text-2xl font-bold mb-1">自己紹介</h1>
        つめありと申します<br/>
        情報系学生やってます<br/>
        趣味はライブ参戦(主に👇女性声優👆)、ウマ娘、麻雀、相撲観戦、競馬観戦etc...<br/>
        推し→<span class="font-bold">小島　菜々恵様</span>、<span class="font-bold text-red-900">スティルインラブ(ウマ娘)</span><br/>
        SNS等リンク: <a href="https://x.com/kabinoyama_beya" class="text-blue-700 font-bold hover:underline">X</a>&nbsp;
        <a href="https://bsky.app/profile/housnorlax.bsky.social" class="text-blue-700 font-bold hover:underline">Bluesky</a>&nbsp;
        <a href="https://www.youtube.com/@kabinoyama_beya" class="text-blue-700 font-bold hover:underline">YouTube</a>
      </div>
      <h1 class="text-2xl font-bold mt-3 mb-3">記事リスト</h1>
      {/* 記事のリストを表示 */}
      <ul>
        {posts.map((ArticleInfo) => (
          <li class="mb-4 p-4 border rounded hover:bg-gray-100">
            <a href={`/posts/${ArticleInfo.slug}`}>
              <h2 class="text-xl font-bold text-blue-600">{ArticleInfo.title}</h2>
              <time class="text-gray-500 text-sm">
                {ArticleInfo.publishedAt.toLocaleDateString("ja-JP")}
              </time>
              <p class="mt-2">{ArticleInfo.snippet}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}