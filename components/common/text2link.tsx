export const text2Link = (text: string) => {
    const regexp_url = /(https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+)/g;
    let linkedComment = text.replace(regexp_url, '<a href="$1" class="text-sky-600" target="_blank" rel="noopener noreferrer">$1</a>');
  
    return linkedComment;
};