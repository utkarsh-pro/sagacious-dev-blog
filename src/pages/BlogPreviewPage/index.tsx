import React from 'react'
import BlogEditor from '../../components/BlogEditor'
import Classes from './index.module.css'

import Global from '../../global/global.module.css'

function BlogPreviewPage() {
    return (
        <div className={Classes.page}>
            <div className={`${Global.container} ${Classes.container}`}>
                <article className={Classes.content}>
                    <BlogEditor readonly />
                </article>
            </div>
        </div>
    )
}

export default BlogPreviewPage
