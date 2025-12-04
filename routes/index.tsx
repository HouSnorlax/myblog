import { Handlers, PageProps } from "$fresh/server.ts";
import { getAllPosts, ArticleData } from "../utils/posts.ts";

// サーバー側でのデータ取得
export const handler: Handlers<ArticleData[]> = {
  async GET(_req, ctx) {
    const posts = await getAllPosts(); 
    return ctx.render(posts);       // データを画面に渡す
  },
};

// 画面への表示
export default function Home(props: PageProps<ArticleData[]>) {
  const posts = props.data; // handlerから渡されたデータを受け取る

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-2xl font-bold mb-6">私のブログ</h1>
      
      {/* 記事のリストを表示 */}
      <ul>
        {posts.map((ArticleData) => (
          <li class="mb-4 p-4 border rounded hover:bg-gray-100">
            <a href={`/posts/${ArticleData.url}`}>
              <h2 class="text-xl font-bold text-blue-600">{ArticleData.title}</h2>
              <time class="text-gray-500 text-sm">
                {ArticleData.publishedAt.toLocaleDateString("ja-JP")}
              </time>
              <p class="mt-2">{ArticleData.snippet}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}