const fs = require('fs');
const code = fs.readFileSync('src/pages/dashboard/Starting.jsx', 'utf8');

function checkTags(code) {
    const stack = [];
    const tagRegex = /<(\/)?([a-zA-Z0-9\.]+)([^>]*?)(\/)?>/g;
    let match;
    while ((match = tagRegex.exec(code)) !== null) {
        const [full, isClose, tagName, attr, isSelfClose] = match;
        if (tagName === 'img' || tagName === 'br' || tagName === 'hr' || tagName === 'input' || isSelfClose) {
            continue;
        }
        if (isClose) {
            const top = stack.pop();
            if (top !== tagName) {
                console.log(`Mismatch: expected </${top}> but found ${full} at index ${match.index}`);
                return;
            }
        } else {
            stack.push(tagName);
        }
    }
    if (stack.length > 0) {
        console.log(`Unclosed tags: ${stack.join(', ')}`);
    } else {
        console.log("Tags are balanced!");
    }
}

checkTags(code);
