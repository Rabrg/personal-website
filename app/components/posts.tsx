import Link from 'next/link'
import {formatDate, getBlogPosts} from 'app/blog/utils'

export function BlogPosts() {
    let allBlogs = getBlogPosts()

    return (
        <div>
            {allBlogs
                .sort((a, b) => {
                    if (
                        new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
                    ) {
                        return -1
                    }
                    return 1
                })
                .map((post) => (
                    <Link
                        key={post.slug}
                        className="flex flex-row items-center space-x-4 mb-4"
                        href={`/blog/${post.slug}`}
                    >
                        <p className="text-neutral-600 dark:text-neutral-400 w-24 text-sm tabular-nums whitespace-nowrap">
                            {formatDate(post.metadata.publishedAt, false)}
                        </p>
                        <p className="text-neutral-900 dark:text-neutral-100 tracking-tight flex-grow">
                            {post.metadata.title}
                        </p>
                    </Link>
                ))}
        </div>
    )
}
