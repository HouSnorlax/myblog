import { Handlers, PageProps } from "$fresh/server.ts";
import { getAllPosts, ArticleInfo } from "../utils/posts.ts";
import { Introduction } from "../components/introduction.tsx";

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

      <Introduction />
      
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
              タグ:
              {ArticleInfo.tag.map((tag: string) => (
                <a class="bg-gray-200 mr-1 p-0.5 border rounded" href={`/posts/search/${tag}`}>{tag}</a> 
              ))}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}