import { Handlers, PageProps } from "$fresh/server.ts";
import { CSS, render} from "@deno/gfm"; // Markdown変換ツール
import { getPost, ArticleInfo } from "../../utils/posts.ts"

interface ArticleData {
    post: ArticleInfo;
    html: string;
}

export const handler: Handlers<ArticleData> = {
    async GET(_req, ctx) {
        const slug = ctx.params.slug; // 記事名の取得
        const post = await getPost(slug); // 記事内容の取得

        if (!post){
            return ctx.renderNotFound();
        }

        const html = render(post.content);
        return ctx.render({ post, html });
    },
};

export default function PostPage(props: PageProps<ArticleData>) {
    const { post, html } = props.data;

    return (
        <>
            {/* Markdown用のCSS読み込み */}
            <head>
                <style dangerouslySetInnerHTML={{ __html: CSS}} />
            </head>


            <div class="p-4 mx-auto max-w-screen-md">
                <p class="mb-4">
                    <a href="/" class="text-blue-600 hover:underline">←　戻る</a>
                </p>
                
                {/* 記事タイトルと日付 */}
                <h1 class="text-3xl font-bold mb-2">{post.title}</h1>
                <time class="text-gray-500 block mb-8">
                {post.publishedAt.toLocaleDateString("ja-JP")}
                </time>

                {/* 記事本文の表示エリア */}
                <div
                class="markdown-body" 
                dangerouslySetInnerHTML={{ __html: html }} 
                />
            </div>
        </>
    );
}