import React from 'react'
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
                    readOnly />
            </div>
        </div>
    )
}

export default LandingPage
