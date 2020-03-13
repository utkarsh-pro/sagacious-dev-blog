import React from 'react';
import { Helmet } from 'react-helmet'
import Editor from '../Editor';

import Classes from './index.module.css'

// ============================================== COMPONENT ==============================================

const initCode = `// C++ Sample Code

#include <iostream>
#include <string>

int main() {
    std::string content;
    std::cout << "Create your own blogs with drag and drop tools";
    std::cin >> content;
    
    return 0;
}`

function LandingPage() {
    return (
        <div className={Classes.landingPage}>
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="description" content="Read and Write quality content using rich set of tools!" />
                <title>Sagacious Dev Blogs</title>
            </Helmet>
            <div className={Classes.container}>
                <div className={Classes.content}>
                    <div className={Classes.head}>Developer's Blog</div>
                    <div className={Classes.sub}>
                        Read and write quality content using rich set of tools
                    </div>
                </div>
                <Editor
                    className={Classes.editor}
                    language="cpp"
                    code={initCode}
                    header
                    readOnly />
            </div>
        </div>
    )
}

export default LandingPage
