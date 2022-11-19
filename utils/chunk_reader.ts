// modified from https://gist.github.com/gyakuse/e6457a6230e4e93092ed242482a240c1

import extract from "png-chunks-extract"

function DiffusionObj (positive?: string, negative?: string, software?: string, sampler?: string, seed?: string, steps?: string, scale?: string, strength?: string, noise?: string) {
  this.positive = positive
  this.negative = negative
  this.software = software
  this.sampler = sampler
  this.seed = seed
  this.steps = steps
  this.scale = scale
  this.strength = strength
  this.noise = noise
}

export function chunk_reader (data) {
  let diffusion_obj
  const chunks = extract(new Uint8Array(data))
  const selected_chunks = selectChunks(chunks, ["tEXt", "iTXt"])
  const decoded_chunks = decodeChunks(selected_chunks)
  if (isNovelAI(decoded_chunks)) {
    return parseNovelAI(decoded_chunks)
  } else if (isStableDiffusion(decoded_chunks)) {
    return parseStableDiffusion(decoded_chunks)
  } else {
    return new DiffusionObj("NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN")
  }
}

function getbetweenstr(str, start, end){
  return str.substring(str.indexOf(start) + start.length, str.lastIndexOf(end));
}

function selectChunks (chunks, select_list) {
  let selected_chunks: any[] = []
  chunks.forEach(chunk => {
    select_list.forEach(name => {
      if (chunk.name === name) {
        selected_chunks.push(chunk)
      }
    })    
  })
  return selected_chunks
}

function decodeChunks (chunks) {
  return chunks.map(data => {
    if (data.data && data.name) {
      data = data.data
    }
  
    var naming = true
    var text_candidate: any[] = []
    var name = ''
  
    for (var i = 0; i < data.length; i++) {
      var code = data[i]
  
      if (naming) {
        if (code) {
          name += String.fromCharCode(code)
        } else {
          naming = false
        }
      } else {
        if (code) {
          text_candidate.push(code)
        } else {
          // do nothing
        }
      }
    }
  
    return {
      keyword: name,
      text: new TextDecoder("utf-8").decode(Uint8Array.from(text_candidate).buffer)
    }
  })
}

function isNovelAI (chunks) {
  let is_novelai = false
  chunks.forEach(chunk => {
    if (chunk.text == "NovelAI") {
      is_novelai = true
    }
  })
  return is_novelai
}

function isStableDiffusion (chunks) {
  let is_stablediffusion = false
  chunks.forEach(chunk => {
    if (chunk.keyword == "parameters") {
      is_stablediffusion = true
    }
  })
  return is_stablediffusion
}

function parseNovelAI (chunks) {
  let diff = new DiffusionObj()
  const params = JSON.parse(chunks[4].text);
  diff.positive = chunks[1].text
  diff.negative = params.uc
  diff.software = chunks[2].text
  diff.sampler = params.sampler
  diff.seed = params.seed
  diff.steps = params.steps
  diff.scale = params.scale
  diff.strength = params.strength
  diff.noise = params.noise
  return diff
}

function parseStableDiffusion (chunks) {
  let diff = new DiffusionObj()
  const str = chunks[0].text
  diff.positive = str.substr(0, str.indexOf('Negative prompt: '))
  diff.negative = getbetweenstr(str, "Negative prompt: ", "Steps: ")
  diff.software = "Stable Diffusion"
  diff.sampler = getbetweenstr(str, "Sampler: ", ", CFG scale:")
  diff.seed = getbetweenstr(str, "Seed: ", ", Size:")
  diff.steps = getbetweenstr(str, "Steps: ", ", Sampler:")
  diff.scale = getbetweenstr(str, "CFG scale: ", ", Seed:")
  diff.strength = "-"
  diff.noise = "-"
  return diff
}