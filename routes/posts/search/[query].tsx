import { Handlers, PageProps } from "$fresh/server.ts";
import { getAllPostsByTag, ArticleInfo } from "../../../utils/posts.ts";

interface ArticleData {
    post: ArticleInfo[];
    searchtag: string;
}

export const handler: Handlers<ArticleData> = {
  async GET(_req, ctx) {
    
    const searchtag = decodeURIComponent(ctx.params.query);
    const post = await getAllPostsByTag(searchtag); 

    return ctx.render({ post, searchtag });       // データを画面に渡す
  },
};

export default function Result(props: PageProps<ArticleData>) {
  const { post, searchtag } = props.data; // handlerから渡されたデータを受け取る

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-2xl font-bold mt-3 mb-3">タグ{searchtag}の記事一覧</h1>
      {/* 記事のリストを表示 */}
      <ul>
        {post.map((ArticleInfo) => (
          <li class="mb-4 p-4 border rounded hover:bg-gray-100">
            <a href={`/posts/${ArticleInfo.slug}`}>
              <h2 class="text-xl font-bold text-blue-600">{ArticleInfo.title}</h2>
              <time class="text-gray-500 text-sm">
                {ArticleInfo.publishedAt.toLocaleDateString("ja-JP")}
              </time>
              <p class="mt-2">{ArticleInfo.snippet}</p>
              タグ:
              {ArticleInfo.tag.map((tag: string) => (
                <a class="bg-gray-200 mr-1 p-0.5 border rounded" href="/">{tag}</a> 
              ))}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
