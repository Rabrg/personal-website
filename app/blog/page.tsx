import {BlogPosts} from 'app/components/posts'

export const metadata = {
    title: 'Musings',
    description: 'Read my musings.',
}

export default function Page() {
    return (
        <section>
            <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Musings</h1>
            <BlogPosts/>
        </section>
    )
}
