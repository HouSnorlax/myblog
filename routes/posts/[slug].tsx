import { Handlers, PageProps } from "$fresh/server.ts";
import { marked } from "https://esm.sh/marked@11.2.0";
import { getPost, ArticleInfo } from "../../utils/posts.ts"
import DOMPurify from "npm:isomorphic-dompurify@2.19.0";
import { CSS } from "@deno/gfm"; 
import { Head } from "$fresh/runtime.ts";

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

        const rawHtml = marked.parse(post.content) as string;

        const html = DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ["style", "class", "width", "height", "target"],
        ADD_TAGS: ["iframe"], // 埋め込み
        });
        
        return ctx.render({ post, html });
    },
};

export default function PostPage(props: PageProps<ArticleData>) {
    const { post, html } = props.data;

    const currentUrl = props.url.href;
    const ogImageUrl = `${props.url.origin}/favicon.ico`;
    const description = post.snippet;

    return (
        <>
            {/* Markdown用のCSS読み込み */}
            <Head>
                <title>{post.title} - MUHO's Blog</title>
                <meta name="description" content={description} />

                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:image" content={ogImageUrl} />
                <meta property="og:site_name" content="MUHO's Blog" />

                <meta name="twitter:card" content="summary" /> 
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={ogImageUrl} />

                <style dangerouslySetInnerHTML={{ __html: CSS}} />
            </Head>


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