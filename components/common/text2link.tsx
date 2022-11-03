import DOMPurify from 'isomorphic-dompurify';

export const text2Link = (text: string) => {
    let cleantext = DOMPurify.sanitize(text);
    const regexp_url = /(https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+)/g;
    let linkedComment = cleantext.replace(regexp_url, '<a href="$1" class="text-sky-600" target="_blank" rel="noopener noreferrer">$1</a>');
  
    return linkedComment;
};