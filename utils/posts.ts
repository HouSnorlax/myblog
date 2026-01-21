// utils/posts.ts
import { extract } from "https://deno.land/std@0.224.0/front_matter/any.ts";

export interface ArticleInfo {
    slug:        string;
    title:       string;    
    publishedAt: Date;
    snippet:     string;  
    tag:         string[];
    content:     string;  
}

// /postsの記事をすべて取得する関数
export async function getAllPosts(): Promise<ArticleInfo[]> {
    const files = Deno.readDir("./routes/posts");
    const posts: ArticleInfo[] = [];

    for await (const file of files) {
        if (!file.name.endsWith(".md")) continue; // .md以外は無視

        const slug = file.name.replace(".md", ""); // ファイル名から拡張子を除く
        const text = await Deno.readTextFile(`./routes/posts/${file.name}`);
        
        // Frontmatterを抜き出す
        const { attrs, body } = extract(text); 
        
        posts.push({
            slug,
            title: attrs.title as string,
            publishedAt: new Date(attrs.published_at as string),
            snippet: attrs.snippet as string,
            tag: attrs.tag as string[],
            content: body,
        });
    }
    // 日付順に並び替え
    return posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

// /postsの特定の記事を取得する関数
export async function getPost(slug: string): Promise<ArticleInfo | null> {
    try {
        const text = await Deno.readTextFile(`./routes/posts/${slug}.md`);
        const { attrs, body } = extract(text);
        return {
            slug,
            title: attrs.title as string,
            publishedAt: new Date(attrs.published_at as string),
            snippet: attrs.snippet as string,
            tag: attrs.tag as string[],
            content: body,
        };
    } catch {
        return null;
    }
}