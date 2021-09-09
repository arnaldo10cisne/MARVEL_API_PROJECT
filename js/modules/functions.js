import * as elem from '../modules/elements.js'

export const $ = (domElementName) => {
    return document.getElementById(domElementName)
}

export const cleanGuidebook = () => {
    elem.characterSearchResults.innerHTML = ""
    elem.characterGalery.innerHTML = ""
    elem.comicGalery.innerHTML = ""
    elem.seriesGalery.innerHTML = ""
    elem.eventsGalery.innerHTML = ""
    elem.creatorsGalery.innerHTML = ""
    elem.storiesGalery.innerHTML = ""
}

export const getAccessData = async () => {
    const response = await fetch("./js/json/APIaccessData.json")
    const data = await response.json()
    return data
}

export const renderMainInfo = (template, elementSelected, cardGalery, nameType) => {
    cleanGuidebook()
    let tempNode = template.content
    let htmlNode = document.importNode(tempNode,true)
    if (nameType == 1) htmlNode.querySelector('.card_title').textContent = elementSelected.name
    if (nameType == 2) htmlNode.querySelector('.card_title').textContent = elementSelected.fullName
    if (nameType == 3) htmlNode.querySelector('.card_title').textContent = elementSelected.title
    if (elementSelected.thumbnail != null) htmlNode.querySelector('.card_thumbnail').setAttribute("src", `${elementSelected.thumbnail.path}.${elementSelected.thumbnail.extension}`)
    htmlNode.querySelector('.card_description').textContent = elementSelected.description
    cardGalery.appendChild(htmlNode)
}

export const renderImages = async (dataURI, idImageContainer, ACCESSDATA) => {
    for (let index = 0; index < dataURI.length; index++) {
        let elementSelected = `${dataURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
        if (elementSelected.startsWith('http://')) {
            elementSelected = `https${elementSelected.slice(4)}`
        }
        const response = await fetch(elementSelected)
        const json = await response.json()
        try {
            $(`${idImageContainer}${index}`).src = `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`
        } catch (error) {
            console.log('Thumbnail loading interrupted')
            break;
        }
    }
}