import React, { useCallback, useRef, useState } from "react"
import ReactTags from 'react-tag-autocomplete'

export default function TagsInput({caption, state, setState, required=false}) {
    type tags = {
        name: string,
        id: string,
        count: number
    };

    const reactTags = useRef()
    const [suggestions, setSuggestions] = useState<tags[]>([]);

    const onDelete = useCallback((tagIndex) => {
        setState(state.filter((tag, index) => index !== tagIndex));
      }, [state])
    
    const onAddition = useCallback((newTag) => {
        var name = newTag.name.startsWith("#") ? newTag.name : `#${newTag.name}`
        var localNewTag = {
            "id": newTag.id,
            "name": name
        }
        setState([...state, localNewTag])  
    }, [state])
    
    const onValidate = useCallback((newTag) => {
        var flag: boolean = state.find(tag => {return tag.name.slice(1) === newTag.name}) === undefined
        return flag
    }, [])
    
    const onInput = async query => {
        if (query !== ""){
          const result = await fetch(`/api/tags/suggest/?word=${query}`)
          setSuggestions(await result.json())
        }
    };


    return (
        <div>
        <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          タグ
        </div>
        <ReactTags
          allowNew
          ref={reactTags}
          tags={state}
          suggestions={suggestions}
          onDelete={onDelete}
          onAddition={onAddition}
          onValidate={onValidate}
          onInput={onInput}
          minQueryLength={1}
          addOnBlur={true}
          placeholderText={"タグを追加"}
          classNames={{
            root: 'relative p-2.5 border border-gray-300 cursor-text bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white border border-gray-300 rounded-lg',
            rootFocused: '',
            selected: 'inline',
            selectedTag: 'inline-block box-border text-base text-sky-600 mr-2 !cursor-pointer hover:line-through',
            search: 'inline-block',
            searchInput: 'max-w-full outline-none bg-gray-50 dark:bg-slate-800',
            suggestions: 'react-tags__suggestions dark:react-tags__suggestions_dark',
            suggestionActive: 'is-active',
            suggestionDisabled: 'is-disabled',
          }} 
        />             
      </div>
    )
}