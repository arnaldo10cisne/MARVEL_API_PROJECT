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
    document.getElementById('cardTypeList').style.display="none"
}

export const getAccessData = async () => {
    const response = await fetch("./js/json/APIaccessData.json")
    const data = await response.json()
    return data
}

export const renderMainInfo = (template, elementSelected, cardGalery, nameType) => {
    cleanGuidebook()
    elem.searchHeroBar.value = ""
    let tempNode = template.content
    let htmlNode = document.importNode(tempNode,true)
    if (nameType == 1) htmlNode.querySelector('.card_title').textContent = elementSelected.name
    if (nameType == 2) htmlNode.querySelector('.card_title').textContent = elementSelected.fullName
    if (nameType == 3) htmlNode.querySelector('.card_title').textContent = elementSelected.title
    if (elementSelected.thumbnail != null) htmlNode.querySelector('.card_thumbnail').setAttribute("src", `${elementSelected.thumbnail.path}.${elementSelected.thumbnail.extension}`)
    htmlNode.querySelector('.card_description').innerHTML = elementSelected.description
    cardGalery.appendChild(htmlNode)
    document.getElementById('cardTypeList').style.display="flex"
    document.getElementById('cardStart').scrollIntoView()
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

export const renderElementsStructure = (template, templateID, structure, structureID, arrayOfElements, elementID, dataURI, renderFn, ACCESSDATA, structureType) => {
    template = document.getElementById(templateID)
    structure = document.getElementById(structureID)
    for (let index = 0; index < arrayOfElements.length; index++) {
        const elementFound = arrayOfElements[index];
        let tempNode = template.content
        let htmlNode = document.importNode(tempNode,true)
        htmlNode.querySelector(`.card_${structureType}_element__name`).textContent = (elementFound.name.length > 30) ? `${elementFound.name.slice(0,30)} ...` : `${elementFound.name}`
        if(structureType == 'rail') htmlNode.querySelector(`.card_${structureType}_element__thumbnail`).setAttribute("id", `${elementID}${index}`)
        if(structureType == 'list') htmlNode.querySelector(`.card_${structureType}_element__name`).setAttribute("id", `${elementID}${index}`)
        dataURI.push(elementFound.resourceURI)
        structure.appendChild(htmlNode)
        $(`${elementID}${index}`).addEventListener("click" , async () => {
            let elementSelected = `${dataURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
            if (elementSelected.startsWith('http://')) {
                elementSelected = `https${elementSelected.slice(4)}`
            }
            const response = await fetch(elementSelected)
            const json = await response.json()
            renderFn(json.data.results[0].id)
        })
        document.getElementById('cardStart').scrollIntoView()
    }
}

export const renderInfoLinks = (template, templateID, structure, structureID, arrayOfElements) => {
    template = document.getElementById(templateID)
    structure = document.getElementById(structureID)
    for (let index = 0; index < arrayOfElements.length; index++) {
        const linkFound = arrayOfElements[index];
        let tempNode = template.content
        let htmlNode = document.importNode(tempNode,true)
        htmlNode.querySelector(`.card_list_element__name`).textContent = linkFound.type.toUpperCase()
        htmlNode.querySelector(`.card_list_element__name`).setAttribute("href", `${linkFound.url}`)
        structure.appendChild(htmlNode)
    }
}