import { useEffect, useState } from "react";
import MarkdownIt from "markdown-it";
import HighlightJs from "highlight.js";
import '../styles/Markdown.css'
import "../styles/intellij-light.css";

function Markdown(props) {
    let [markdownText, setMarkdownText] = useState(null);

    useEffect(() => {
        const markdown = new MarkdownIt({
            typographer: true, 
            linkify: true,
            highlight: highlight
        });
        setMarkdownText(
            markdown.render(props.text)
        )
    }, [props.text])

    return (
        <div className="markdown" dangerouslySetInnerHTML={{__html: markdownText}}/>
    )
}

function highlight(str, lang)  {
    if (lang && HighlightJs.getLanguage(lang)) {
        try {
            return HighlightJs.highlight(str, { language: lang }).value;
        } catch (e) {
            console.log(`Error occurs when highlighting text: ${e}`);
        }
    }
    return '';
}

export default Markdown;
