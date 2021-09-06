import * as func from './modules/functions.js'

const searchHeroBar = document.getElementById('searchHeroBar')
const searchButton = document.getElementById('searchButton')
const findRandomButton = document.getElementById('findRandomButton')
const charThumbnail = document.getElementById('charThumbnail')
const charName = document.getElementById('charName')
const charDescription = document.getElementById('charDescription')
const characterGalery = document.getElementById('characterGalery')
const comicGalery = document.getElementById('comicGalery')
const characterSearchResults = document.getElementById('characterSearchResults')
const templateSearchResults = document.getElementById('templateSearchResults')
const templateCharacterRender = document.getElementById('templateCharacterRender')
const templateComicRender = document.getElementById('templateComicRender')

let ACCESSDATA

const getAccessData = async () => {
    const response = await fetch("./js/json/APIaccessData.json")
    const data = await response.json()
    ACCESSDATA = data
}

const cleanGuidebook = () => {
    characterSearchResults.innerHTML = ""
    characterGalery.innerHTML = ""
    comicGalery.innerHTML = ""
}

const marvel = {
    createListOfCharacters: async (startsWith) => {
        const URLAPI = `https://gateway.marvel.com:443/v1/public/characters?${ACCESSDATA.tsAccess}&nameStartsWith=${startsWith}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`;
        const response = await fetch(URLAPI)
        const json = await response.json()
        
        // Code to create list of possible choices
        {
            cleanGuidebook()
            if (json.data.results.length == 1) {
                marvel.renderCharacter(json.data.results[0].name)
            } else {
                for (let index = 0; index < json.data.results.length; index++) {
                    const heroFound = json.data.results[index];
                    let tempNode = templateSearchResults.content
                    let htmlNode = document.importNode(tempNode,true)
                    htmlNode.querySelector('.character_search_result__container__name').textContent = heroFound.name
                    htmlNode.querySelector('.character_search_result__picture').setAttribute("src", `${heroFound.thumbnail.path}.${heroFound.thumbnail.extension}`)
                    htmlNode.querySelector('.character_search_result__container').setAttribute("id", `resultID${index}`)
                    characterSearchResults.appendChild(htmlNode)
                    func.$(`resultID${index}`).addEventListener("click" , () => {
                        marvel.renderCharacter(heroFound.name)
                    })
                }
            }
        }
    },
    renderCharacter: async (name) => {
        const URLAPI = `https://gateway.marvel.com:443/v1/public/characters?${ACCESSDATA.tsAccess}&name=${name}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
        const response = await fetch(URLAPI)
        const json = await response.json()    
        const heroSelected = await json.data.results[0]

        let comicThumbnailsURI = []
        let seriesThumbnailsURI = []
        let storiesURI = []
        
        //Code to create render and description of character
        {
            cleanGuidebook()
            console.log("HERO SELECTED: ", json)
            let tempNode = templateCharacterRender.content
            let htmlNode = document.importNode(tempNode,true)
            htmlNode.querySelector('.card_title').textContent = heroSelected.name
            htmlNode.querySelector('.card_thumbnail').setAttribute("src", `${heroSelected.thumbnail.path}.${heroSelected.thumbnail.extension}`)
            htmlNode.querySelector('.card_description').textContent = heroSelected.description
            characterGalery.appendChild(htmlNode)
        }

        // Code to create list of comics
        {
            const comicRailTemplate = document.getElementById('comicRailTemplate')
            const comicsRail = document.getElementById('comicsRail')
            for (let index = 0; index < heroSelected.comics.items.length; index++) {
                const comicFound = heroSelected.comics.items[index];
                let tempNode = comicRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (comicFound.name.length > 30) ? `${comicFound.name.slice(0,30)} ...` : `${comicFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `comicPicture${index}`)
                comicThumbnailsURI.push(comicFound.resourceURI)
                comicsRail.appendChild(htmlNode)
                func.$(`comicPicture${index}`).addEventListener("click" , async () => {
                    let comicSelected = `${comicThumbnailsURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                    if (comicSelected.startsWith('http://')) {
                        comicSelected = `https${comicSelected.slice(4)}`
                    }
                    const response = await fetch(comicSelected)
                    const json = await response.json()
                    marvel.renderComic(json.data.results[0].id)
                })
            }
        }

        // Code to create list of series
        {
            const seriesRailTemplate = document.getElementById('seriesRailTemplate')
            const seriesRail = document.getElementById('seriesRail')
            for (let index = 0; index < heroSelected.series.items.length; index++) {
                const seriesFound = heroSelected.series.items[index];
                let tempNode = seriesRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (seriesFound.name.length > 30) ? `${seriesFound.name.slice(0,30)} ...` : `${seriesFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `seriesPicture${index}`)
                seriesThumbnailsURI.push(seriesFound.resourceURI)
                seriesRail.appendChild(htmlNode)
            }
        }

        // Code to create list of stories
        {
            const storiesListTemplate = document.getElementById('storiesListTemplate')
            const storiesList = document.getElementById('storiesList')
            for (let index = 0; index < heroSelected.stories.items.length; index++) {
                const storiesFound = heroSelected.stories.items[index];
                let tempNode = storiesListTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_list_element__name').textContent = (storiesFound.name.length > 30) ? `${storiesFound.name.slice(0,30)} ...` : `${storiesFound.name}`
                storiesURI.push(storiesFound.resourceURI)
                storiesList.appendChild(htmlNode)
            }
        }
        
        // Code to add thumbnails to comics
        {
            for (let index = 0; index < comicThumbnailsURI.length; index++) {
                let comicSelected = `${comicThumbnailsURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                if (comicSelected.startsWith('http://')) {
                    comicSelected = `https${comicSelected.slice(4)}`
                }
                const response = await fetch(comicSelected)
                const json = await response.json()
                func.$(`comicPicture${index}`).src = `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`
            }
        }

        // Code to add thumbanails to series
        {
            for (let index = 0; index < seriesThumbnailsURI.length; index++) {
                let seriesSelected = `${seriesThumbnailsURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                if (seriesSelected.startsWith('http://')) {
                    seriesSelected = `https${seriesSelected.slice(4)}`
                }
                const response = await fetch(seriesSelected)
                const json = await response.json()
                func.$(`seriesPicture${index}`).src = `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`
            }
        }
    },
    renderComic: async (id) => {

        const URLAPI = `https://gateway.marvel.com:443/v1/public/comics/${id}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
        const response = await fetch(URLAPI)
        const json = await response.json()    
        const comicSelected = await json.data.results[0]

        // Code to render Comic information
        {
            cleanGuidebook()
            console.log('COMIC SELECTED: ', json)
            let tempNode = templateComicRender.content
            let htmlNode = document.importNode(tempNode,true)
            htmlNode.querySelector('.card_title').textContent = comicSelected.title
            htmlNode.querySelector('.card_thumbnail').setAttribute("src", `${comicSelected.thumbnail.path}.${comicSelected.thumbnail.extension}`)
            htmlNode.querySelector('.card_description').textContent = comicSelected.description
            comicGalery.appendChild(htmlNode)
        }

        // Code to create list of characters
        {
            const comicGalery_charactersRailTemplate = document.getElementById('comicGalery_charactersRailTemplate')
            const comicsRail = document.getElementById('comicsRail')
            for (let index = 0; index < heroSelected.comics.items.length; index++) {
                const comicFound = heroSelected.comics.items[index];
                let tempNode = comicRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (comicFound.name.length > 30) ? `${comicFound.name.slice(0,30)} ...` : `${comicFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `comicPicture${index}`)
                comicThumbnailsURI.push(comicFound.resourceURI)
                comicsRail.appendChild(htmlNode)
                func.$(`comicPicture${index}`).addEventListener("click" , async () => {
                    let comicSelected = `${comicThumbnailsURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                    if (comicSelected.startsWith('http://')) {
                        comicSelected = `https${comicSelected.slice(4)}`
                    }
                    const response = await fetch(comicSelected)
                    const json = await response.json()
                    marvel.renderComic(json.data.results[0].id)
                })
            }
        }
    },
}

searchButton.addEventListener("click", ()=>{
    let hero = searchHeroBar.value
    marvel.createListOfCharacters(hero)
})

getAccessData()