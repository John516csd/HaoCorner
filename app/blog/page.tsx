import { BlogPosts } from 'app/components/posts'

export const metadata = {
  title: '博客',
  description: '阅读我的博客文章。',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">我的博客</h1>
      <BlogPosts />
    </section>
  )
}
