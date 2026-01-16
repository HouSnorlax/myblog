import { PageProps } from "$fresh/server.ts";

export default function Layout({ Component }: PageProps) {
    return (
        <div class="flex flex-col min-h-screen">
            {/* ■ 共通ヘッダー */}
            <header class="bg-gray-800 text-white p-4">
                <div class="max-w-screen-md mx-auto flex justify-between items-center">
                    <a href="/" class="text-xl font-bold">MUHOのブログ</a>
                    <nav>
                        {/* リンクを追加したくなったらここに書く */}
                        <a href="/" class="hover:text-gray-300">Home</a>
                    </nav>
                </div>
            </header>

            {/* ■ ページごとの中身（index.tsx や [slug].tsx）がここに入ります */}
            <main class="flex-grow">
                <Component />
            </main>

            {/* ■ 共通フッター */}
            <div class="mx-auto flex flex-col items-center justify-center text-xl">
                <img src="/13.png" alt="KSGM"/>
                <p>KSGMがこちらを見ている</p>
            </div>
            <footer class="bg-gray-100 text-center p-6 text-gray-500 text-sm mt-8">
                &copy; {new Date().getFullYear()} MUHO's Blog. Built with Deno Fresh.
            </footer>
        </div>
    );
}