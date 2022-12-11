
export const t = ( key, str, object: any=undefined ) => {
    const regex = /\{{.*?\}}/g
    console.log(str)
    if (regex.test(str)){
      return str.replace(regex, function(match){
        return object[match.substring(2, match.length-2)]
      })
    }
    return str
}