import React from 'react'
import BlogEditor from '../../components/BlogEditor'
import Classes from './index.module.css'

import Global from '../../global/global.module.css'

function BlogEditorPage() {
    return (
        <div className={Classes.wrapper}>
            <div className={`${Global.container} ${Classes.container}`}>
                <BlogEditor />
            </div>
        </div>
    )
}

export default BlogEditorPage
