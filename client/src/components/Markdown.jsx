import { useEffect, useState } from 'react';
import MarkdownIt from 'markdown-it';
import HighlightJs from 'highlight.js';
import '../styles/Markdown.css';
import '../styles/intellij-light.css';

function highlight(str, lang) {
    if (lang && HighlightJs.getLanguage(lang)) {
        try {
            return HighlightJs.highlight(str, { language: lang }).value;
        } catch (e) {
            console.log(`Error occurs when highlighting text: ${e}`);
        }
    }
    return '';
}

function Markdown({ text }) {
    const [markdownText, setMarkdownText] = useState(null);

    useEffect(() => {
        const markdown = new MarkdownIt({
            typographer: true,
            linkify: true,
            highlight,
        });
        setMarkdownText(
            markdown.render(text),
        );
    }, [text]);

    return (
        <div className="markdown" dangerouslySetInnerHTML={{ __html: markdownText }} />
    );
}

export default Markdown;
