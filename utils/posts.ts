// utils/posts.ts
import { extract } from "https://deno.land/std@0.224.0/front_matter/any.ts";

export interface ArticleData {
    url:        string;
    title:       string;    
    publishedAt: Date;
    snippet:     string;  
    content:     string;  
}

// /postsの記事をすべて取得する関数
export async function getAllPosts(): Promise<ArticleData[]> {
    const files = Deno.readDir("./posts");
    const posts: ArticleData[] = [];

    for await (const file of files) {
        if (!file.name.endsWith(".md")) continue; // .md以外は無視

        const url = file.name.replace(".md", ""); // ファイル名から拡張子を除く
        const text = await Deno.readTextFile(`./posts/${file.name}`);
        
        // Frontmatterを抜き出す
        const { attrs, body } = extract(text); 
        
        posts.push({
            url,
            title: attrs.title as string,
            publishedAt: new Date(attrs.published_at as string),
            snippet: attrs.snippet as string,
            content: body,
        });
    }

    // 日付順に並び替え
    return posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}