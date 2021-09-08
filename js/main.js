import * as func from './modules/functions.js'

const searchHeroBar = document.getElementById('searchHeroBar')
const searchButton = document.getElementById('searchButton')
const findRandomButton = document.getElementById('findRandomButton')
const characterGalery = document.getElementById('characterGalery')
const comicGalery = document.getElementById('comicGalery')
const characterSearchResults = document.getElementById('characterSearchResults')
const templateSearchResults = document.getElementById('templateSearchResults')
const templateCharacterRender = document.getElementById('templateCharacterRender')
const templateComicRender = document.getElementById('templateComicRender')
const templateSeriesRender = document.getElementById('templateSeriesRender')
const templateEventsRender = document.getElementById('templateEventsRender')
const templateCreatorsRender = document.getElementById('templateCreatorsRender')

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
    seriesGalery.innerHTML = ""
    eventsGalery.innerHTML = ""
    creatorsGalery.innerHTML = ""
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

        let comicURI = []
        let seriesURI = []
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
            const charactersGalery_comicRailTemplate = document.getElementById('charactersGalery_comicRailTemplate')
            const charactersGalery_comicsRail = document.getElementById('charactersGalery_comicsRail')
            for (let index = 0; index < heroSelected.comics.items.length; index++) {
                const comicFound = heroSelected.comics.items[index];
                let tempNode = charactersGalery_comicRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (comicFound.name.length > 30) ? `${comicFound.name.slice(0,30)} ...` : `${comicFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `comicPicture${index}`)
                comicURI.push(comicFound.resourceURI)
                charactersGalery_comicsRail.appendChild(htmlNode)
                func.$(`comicPicture${index}`).addEventListener("click" , async () => {
                    let comicSelected = `${comicURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
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
            const charactersGalery_seriesRailTemplate = document.getElementById('charactersGalery_seriesRailTemplate')
            const charactersGalery_seriesRail = document.getElementById('charactersGalery_seriesRail')
            for (let index = 0; index < heroSelected.series.items.length; index++) {
                const seriesFound = heroSelected.series.items[index];
                let tempNode = charactersGalery_seriesRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (seriesFound.name.length > 30) ? `${seriesFound.name.slice(0,30)} ...` : `${seriesFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `seriesPicture${index}`)
                seriesURI.push(seriesFound.resourceURI)
                charactersGalery_seriesRail.appendChild(htmlNode)
                func.$(`seriesPicture${index}`).addEventListener("click" , async () => {
                    let seriesSelected = `${seriesURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                    if (seriesSelected.startsWith('http://')) {
                        seriesSelected = `https${seriesSelected.slice(4)}`
                    }
                    const response = await fetch(seriesSelected)
                    const json = await response.json()
                    marvel.renderSeries(json.data.results[0].id)
                })
            }
        }

        // Code to create list of stories
        {
            const charactersGalery_storiesListTemplate = document.getElementById('charactersGalery_storiesListTemplate')
            const charactersGalery_storiesList = document.getElementById('charactersGalery_storiesList')
            for (let index = 0; index < heroSelected.stories.items.length; index++) {
                const storiesFound = heroSelected.stories.items[index];
                let tempNode = charactersGalery_storiesListTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_list_element__name').textContent = (storiesFound.name.length > 30) ? `${storiesFound.name.slice(0,30)} ...` : `${storiesFound.name}`
                storiesURI.push(storiesFound.resourceURI)
                charactersGalery_storiesList.appendChild(htmlNode)
            }
        }
        
        // Code to add thumbnails to comics
        {
            for (let index = 0; index < comicURI.length; index++) {
                let comicSelected = `${comicURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
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
            for (let index = 0; index < seriesURI.length; index++) {
                let seriesSelected = `${seriesURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
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

        let charactersURI = []
        let creatorsURI = []
        let storiesURI = []
        let seriesURI

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
            const comicGalery_charactersRail = document.getElementById('comicGalery_charactersRail')
            for (let index = 0; index < comicSelected.characters.items.length; index++) {
                const heroFound = comicSelected.characters.items[index];
                let tempNode = comicGalery_charactersRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (heroFound.name.length > 30) ? `${heroFound.name.slice(0,30)} ...` : `${heroFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `charactersPicture${index}`)
                charactersURI.push(heroFound.resourceURI)
                comicGalery_charactersRail.appendChild(htmlNode)
                func.$(`charactersPicture${index}`).addEventListener("click" , async () => {
                    marvel.renderCharacter(heroFound.name)
                })
            }
        }

        // Code to create list of creators
        {
            const comicGalery_creatorsListTemplate = document.getElementById('comicGalery_creatorsListTemplate')
            const comicGalery_creatorsList = document.getElementById('comicGalery_creatorsList')
            for (let index = 0; index < comicSelected.creators.items.length; index++) {
                const creatorFound = comicSelected.creators.items[index];
                let tempNode = comicGalery_creatorsListTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_list_element__name').textContent = (creatorFound.name.length > 30) ? `${creatorFound.name.slice(0,30)} ...` : `${creatorFound.name}`
                htmlNode.querySelector('.card_list_element__name').setAttribute("id", `creatorsLink${index}`)
                creatorsURI.push(creatorFound.resourceURI)
                comicGalery_creatorsList.appendChild(htmlNode)
                
                func.$(`creatorsLink${index}`).addEventListener("click" , async () => {
                    let creatorSelected = `${creatorsURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                    if (creatorSelected.startsWith('http://')) {
                        creatorSelected = `https${creatorSelected.slice(4)}`
                    }
                    const response = await fetch(creatorSelected)
                    const json = await response.json()
                    marvel.renderCreators(json.data.results[0].id)
                })
            }
        }

        // Code to create list of series
        {
            const comicGalery_seriesRailTemplate = document.getElementById('comicGalery_seriesRailTemplate')
            const comicGalery_seriesRail = document.getElementById('comicGalery_seriesRail')
            const seriesFound = comicSelected.series
            let tempNode = comicGalery_seriesRailTemplate.content
            let htmlNode = document.importNode(tempNode,true)
            htmlNode.querySelector('.card_rail_element__name').textContent = (seriesFound.name.length > 30) ? `${seriesFound.name.slice(0,30)} ...` : `${seriesFound.name}`
            htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `seriesPicture`)
            seriesURI = seriesFound.resourceURI
            if (seriesURI.startsWith('http://')) {
                seriesURI = `https${seriesURI.slice(4)}`
            }
            comicGalery_seriesRail.appendChild(htmlNode)
            func.$('seriesPicture').addEventListener("click", async () => {
                let seriesSelected = `${seriesURI}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                if (seriesSelected.startsWith('http://')) {
                    seriesSelected = `https${seriesSelected.slice(4)}`
                }
                const response = await fetch(seriesSelected)
                const json = await response.json()
                marvel.renderSeries(json.data.results[0].id)
            })
        }

        // Code to create list of stories
        {
            const comicGalery_storiesListTemplate = document.getElementById('comicGalery_storiesListTemplate')
            const comicGalery_storiesList = document.getElementById('comicGalery_storiesList')
            for (let index = 0; index < comicSelected.stories.items.length; index++) {
                const storiesFound = comicSelected.stories.items[index];
                let tempNode = comicGalery_storiesListTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_list_element__name').textContent = (storiesFound.name.length > 30) ? `${storiesFound.name.slice(0,30)} ...` : `${storiesFound.name}`
                storiesURI.push(storiesFound.resourceURI)
                comicGalery_storiesList.appendChild(htmlNode)
            }
        }

        // Code to add thumbnails to characters
        {
            for (let index = 0; index < charactersURI.length; index++) {
                let characterSelected = `${charactersURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                if (characterSelected.startsWith('http://')) {
                    characterSelected = `https${characterSelected.slice(4)}`
                }
                const response = await fetch(characterSelected)
                const json = await response.json()
                func.$(`charactersPicture${index}`).src = `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`
            }
        }

        // Code to add thumbanails to series
        {
            let seriesSelected = `${seriesURI}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
            if (seriesSelected.startsWith('http://')) {
                seriesSelected = `https${seriesSelected.slice(4)}`
            }
            const response = await fetch(seriesSelected)
            const json = await response.json()
            func.$(`seriesPicture`).src = `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`
        }
    },
    renderCreators: async (id) =>{
        
        const URLAPI = `https://gateway.marvel.com:443/v1/public/creators/${id}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
        const response = await fetch(URLAPI)
        const json = await response.json()    
        const creatorSelected = await json.data.results[0]

        let comicURI = []
        let eventsURI = []
        let storiesURI = []
        let seriesURI = []

        //Code to render Creator information
        {
            cleanGuidebook()
            console.log('CREATOR SELECTED: ', json)
            let tempNode = templateCreatorsRender.content
            let htmlNode = document.importNode(tempNode,true)
            htmlNode.querySelector('.card_title').textContent = creatorSelected.fullName
            htmlNode.querySelector('.card_thumbnail').setAttribute("src", `${creatorSelected.thumbnail.path}.${creatorSelected.thumbnail.extension}`)
            htmlNode.querySelector('.card_description').textContent = creatorSelected.description
            seriesGalery.appendChild(htmlNode)
        }

        // Code to create list of comics
        {
            const creatorsGalery_comicsRailTemplate = document.getElementById('creatorsGalery_comicsRailTemplate')
            const creatorsGalery_comicsRail = document.getElementById('creatorsGalery_comicsRail')
            for (let index = 0; index < creatorSelected.comics.items.length; index++) {
                const comicFound = creatorSelected.comics.items[index];
                let tempNode = creatorsGalery_comicsRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (comicFound.name.length > 30) ? `${comicFound.name.slice(0,30)} ...` : `${comicFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `comicPicture${index}`)
                comicURI.push(comicFound.resourceURI)
                creatorsGalery_comicsRail.appendChild(htmlNode)
                func.$(`comicPicture${index}`).addEventListener("click" , async () => {
                    let comicSelected = `${comicURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
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
            const creatorsGalery_seriesRailTemplate = document.getElementById('creatorsGalery_seriesRailTemplate')
            const creatorsGalery_seriesRail = document.getElementById('creatorsGalery_seriesRail')
            for (let index = 0; index < creatorSelected.series.items.length; index++) {
                const seriesFound = creatorSelected.series.items[index];
                let tempNode = creatorsGalery_seriesRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (seriesFound.name.length > 30) ? `${seriesFound.name.slice(0,30)} ...` : `${seriesFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `seriesPicture${index}`)
                seriesURI.push(seriesFound.resourceURI)
                creatorsGalery_seriesRail.appendChild(htmlNode)
                func.$(`seriesPicture${index}`).addEventListener("click" , async () => {
                    let seriesSelected = `${seriesURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                    if (seriesSelected.startsWith('http://')) {
                        seriesSelected = `https${seriesSelected.slice(4)}`
                    }
                    const response = await fetch(seriesSelected)
                    const json = await response.json()
                    marvel.renderSeries(json.data.results[0].id)
                })
            }
        }

        // Code to create list of stories
        {
            const creatorsGalery_storiesListTemplate = document.getElementById('creatorsGalery_storiesListTemplate')
            const creatorsGalery_storiesList = document.getElementById('creatorsGalery_storiesList')
            for (let index = 0; index < creatorSelected.stories.items.length; index++) {
                const storiesFound = creatorSelected.stories.items[index];
                let tempNode = creatorsGalery_storiesListTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_list_element__name').textContent = (storiesFound.name.length > 30) ? `${storiesFound.name.slice(0,30)} ...` : `${storiesFound.name}`
                storiesURI.push(storiesFound.resourceURI)
                creatorsGalery_storiesList.appendChild(htmlNode)
            }
        }

        // Code to create list of events
        {
            const creatorsGalery_eventsRailTemplate = document.getElementById('creatorsGalery_eventsRailTemplate')
            const creatorsGalery_eventsRail = document.getElementById('creatorsGalery_eventsRail')
            for (let index = 0; index < creatorSelected.events.items.length; index++) {
                const eventFound = creatorSelected.events.items[index];
                let tempNode = creatorsGalery_eventsRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (eventFound.name.length > 30) ? `${eventFound.name.slice(0,30)} ...` : `${eventFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `eventsPicture${index}`)
                eventsURI.push(eventFound.resourceURI)
                creatorsGalery_eventsRail.appendChild(htmlNode)
                func.$(`eventsPicture${index}`).addEventListener("click" , async () => {
                    let eventsSelected = `${eventsURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                    if (eventsSelected.startsWith('http://')) {
                        eventsSelected = `https${eventsSelected.slice(4)}`
                    }
                    const response = await fetch(eventsSelected)
                    const json = await response.json()
                    marvel.renderEvents(json.data.results[0].id)
                })
            }
        }
        
        // Code to add thumbnails to comics
        {
            for (let index = 0; index < comicURI.length; index++) {
                let comicSelected = `${comicURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
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
            for (let index = 0; index < seriesURI.length; index++) {
                let seriesSelected = `${seriesURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                if (seriesSelected.startsWith('http://')) {
                    seriesSelected = `https${seriesSelected.slice(4)}`
                }
                const response = await fetch(seriesSelected)
                const json = await response.json()
                func.$(`seriesPicture${index}`).src = `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`
            }
        }

        // Code to add thumbnails to events
        {
            for (let index = 0; index < eventsURI.length; index++) {
                let eventsSelected = `${eventsURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                if (eventsSelected.startsWith('http://')) {
                    eventsSelected = `https${eventsSelected.slice(4)}`
                }
                const response = await fetch(eventsSelected)
                const json = await response.json()
                func.$(`eventsPicture${index}`).src = `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`
            }
        }

    },
    renderSeries: async(id) =>{
        
        const URLAPI = `https://gateway.marvel.com:443/v1/public/series/${id}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
        const response = await fetch(URLAPI)
        const json = await response.json()    
        const seriesSelected = await json.data.results[0]

        let charactersURI = []
        let creatorsURI = []
        let storiesURI = []
        let comicURI = []
        let eventsURI = []
        
        // Code to render Series information
        {
            cleanGuidebook()
            console.log('SERIES SELECTED: ', json)
            let tempNode = templateSeriesRender.content
            let htmlNode = document.importNode(tempNode,true)
            htmlNode.querySelector('.card_title').textContent = seriesSelected.title
            htmlNode.querySelector('.card_thumbnail').setAttribute("src", `${seriesSelected.thumbnail.path}.${seriesSelected.thumbnail.extension}`)
            htmlNode.querySelector('.card_description').textContent = seriesSelected.description
            seriesGalery.appendChild(htmlNode)
        }

        // Code to create list of characters
        {
            const seriesGalery_charactersRailTemplate = document.getElementById('seriesGalery_charactersRailTemplate')
            const seriesGalery_charactersRail = document.getElementById('seriesGalery_charactersRail')
            for (let index = 0; index < seriesSelected.characters.items.length; index++) {
                const heroFound = seriesSelected.characters.items[index];
                let tempNode = seriesGalery_charactersRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (heroFound.name.length > 30) ? `${heroFound.name.slice(0,30)} ...` : `${heroFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `charactersPicture${index}`)
                charactersURI.push(heroFound.resourceURI)
                seriesGalery_charactersRail.appendChild(htmlNode)
                func.$(`charactersPicture${index}`).addEventListener("click" , async () => {
                    marvel.renderCharacter(heroFound.name)
                })
            }
        }

        // Code to create list of creators
        {
            const seriesGalery_creatorsListTemplate = document.getElementById('seriesGalery_creatorsListTemplate')
            const seriesGalery_creatorsList = document.getElementById('seriesGalery_creatorsList')
            for (let index = 0; index < seriesSelected.creators.items.length; index++) {
                const creatorFound = seriesSelected.creators.items[index];
                let tempNode = seriesGalery_creatorsListTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_list_element__name').textContent = (creatorFound.name.length > 30) ? `${creatorFound.name.slice(0,30)} ...` : `${creatorFound.name}`
                htmlNode.querySelector('.card_list_element__name').setAttribute("id", `creatorsLink${index}`)
                creatorsURI.push(creatorFound.resourceURI)
                seriesGalery_creatorsList.appendChild(htmlNode)
                func.$(`creatorsLink${index}`).addEventListener("click" , async () => {
                    let creatorSelected = `${creatorsURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                    if (creatorSelected.startsWith('http://')) {
                        creatorSelected = `https${creatorSelected.slice(4)}`
                    }
                    const response = await fetch(creatorSelected)
                    const json = await response.json()
                    marvel.renderCreators(json.data.results[0].id)
                })
            }
        }

        // Code to create list of comics
        {
            const seriesGalery_comicRailTemplate = document.getElementById('seriesGalery_comicRailTemplate')
            const seriesGalery_comicRail = document.getElementById('seriesGalery_comicRail')
            for (let index = 0; index < seriesSelected.comics.items.length; index++) {
                const comicFound = seriesSelected.comics.items[index];
                let tempNode = seriesGalery_comicRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (comicFound.name.length > 30) ? `${comicFound.name.slice(0,30)} ...` : `${comicFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `comicPicture${index}`)
                comicURI.push(comicFound.resourceURI)
                seriesGalery_comicRail.appendChild(htmlNode)
                func.$(`comicPicture${index}`).addEventListener("click" , async () => {
                    let comicSelected = `${comicURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                    if (comicSelected.startsWith('http://')) {
                        comicSelected = `https${comicSelected.slice(4)}`
                    }
                    const response = await fetch(comicSelected)
                    const json = await response.json()
                    marvel.renderComic(json.data.results[0].id)
                })
            }
        }

        // Code to create list of stories
        {
            const seriesGalery_storiesListTemplate = document.getElementById('seriesGalery_storiesListTemplate')
            const seriesGalery_storiesList = document.getElementById('seriesGalery_storiesList')
            for (let index = 0; index < seriesSelected.stories.items.length; index++) {
                const storiesFound = seriesSelected.stories.items[index];
                let tempNode = seriesGalery_storiesListTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_list_element__name').textContent = (storiesFound.name.length > 30) ? `${storiesFound.name.slice(0,30)} ...` : `${storiesFound.name}`
                storiesURI.push(storiesFound.resourceURI)
                seriesGalery_storiesList.appendChild(htmlNode)
            }
        }

        // Code to create list of events
        {
            const seriesGalery_eventsRailTemplate = document.getElementById('seriesGalery_eventsRailTemplate')
            const seriesGalery_eventsRail = document.getElementById('seriesGalery_eventsRail')
            for (let index = 0; index < seriesSelected.events.items.length; index++) {
                const eventFound = seriesSelected.events.items[index];
                let tempNode = seriesGalery_eventsRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (eventFound.name.length > 30) ? `${eventFound.name.slice(0,30)} ...` : `${eventFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `eventsPicture${index}`)
                eventsURI.push(eventFound.resourceURI)
                seriesGalery_eventsRail.appendChild(htmlNode)
                func.$(`eventsPicture${index}`).addEventListener("click" , async () => {
                    let eventsSelected = `${eventsURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                    if (eventsSelected.startsWith('http://')) {
                        eventsSelected = `https${eventsSelected.slice(4)}`
                    }
                    const response = await fetch(eventsSelected)
                    const json = await response.json()
                    marvel.renderEvents(json.data.results[0].id)
                })
            }
        }

        // Code to add thumbnails to characters
        {
            for (let index = 0; index < charactersURI.length; index++) {
                let characterSelected = `${charactersURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                if (characterSelected.startsWith('http://')) {
                    characterSelected = `https${characterSelected.slice(4)}`
                }
                const response = await fetch(characterSelected)
                const json = await response.json()
                func.$(`charactersPicture${index}`).src = `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`
            }
        }

        // Code to add thumbnails to comics
        {
            for (let index = 0; index < comicURI.length; index++) {
                let comicSelected = `${comicURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                if (comicSelected.startsWith('http://')) {
                    comicSelected = `https${comicSelected.slice(4)}`
                }
                const response = await fetch(comicSelected)
                const json = await response.json()
                func.$(`comicPicture${index}`).src = `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`
            }
        }

        // Code to add thumbnails to events
        {
            for (let index = 0; index < eventsURI.length; index++) {
                let eventsSelected = `${eventsURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                if (eventsSelected.startsWith('http://')) {
                    eventsSelected = `https${eventsSelected.slice(4)}`
                }
                const response = await fetch(eventsSelected)
                const json = await response.json()
                func.$(`eventsPicture${index}`).src = `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`
            }
        }
    },
    renderStories: async (id) =>{
        console.log('renderStories NOT READY')
    },
    renderEvents: async (id) =>{
        
        const URLAPI = `https://gateway.marvel.com:443/v1/public/events/${id}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
        const response = await fetch(URLAPI)
        const json = await response.json()    
        const eventsSelected = await json.data.results[0]

        let charactersURI = []
        let creatorsURI = []
        let storiesURI = []
        let comicURI = []
        let seriesURI = []
        
        // Code to render Events information
        {
            cleanGuidebook()
            console.log('EVENT SELECTED: ', json)
            let tempNode = templateEventsRender.content
            let htmlNode = document.importNode(tempNode,true)
            htmlNode.querySelector('.card_title').textContent = eventsSelected.title
            htmlNode.querySelector('.card_thumbnail').setAttribute("src", `${eventsSelected.thumbnail.path}.${eventsSelected.thumbnail.extension}`)
            htmlNode.querySelector('.card_description').textContent = eventsSelected.description
            eventsGalery.appendChild(htmlNode)
        }

        // Code to create list of characters
        {
            const eventsGalery_charactersRailTemplate = document.getElementById('eventsGalery_charactersRailTemplate')
            const eventsGalery_charactersRail = document.getElementById('eventsGalery_charactersRail')
            for (let index = 0; index < eventsSelected.characters.items.length; index++) {
                const heroFound = eventsSelected.characters.items[index];
                let tempNode = eventsGalery_charactersRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (heroFound.name.length > 30) ? `${heroFound.name.slice(0,30)} ...` : `${heroFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `charactersPicture${index}`)
                charactersURI.push(heroFound.resourceURI)
                eventsGalery_charactersRail.appendChild(htmlNode)
                func.$(`charactersPicture${index}`).addEventListener("click" , async () => {
                    marvel.renderCharacter(heroFound.name)
                })
            }
        }

        // Code to create list of creators
        {
            const eventsGalery_creatorsListTemplate = document.getElementById('eventsGalery_creatorsListTemplate')
            const eventsGalery_creatorsList = document.getElementById('eventsGalery_creatorsList')
            for (let index = 0; index < eventsSelected.creators.items.length; index++) {
                const creatorFound = eventsSelected.creators.items[index];
                let tempNode = eventsGalery_creatorsListTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_list_element__name').textContent = (creatorFound.name.length > 30) ? `${creatorFound.name.slice(0,30)} ...` : `${creatorFound.name}`
                htmlNode.querySelector('.card_list_element__name').setAttribute("id", `creatorsLink${index}`)
                creatorsURI.push(creatorFound.resourceURI)
                eventsGalery_creatorsList.appendChild(htmlNode)
                func.$(`creatorsLink${index}`).addEventListener("click" , async () => {
                    let creatorSelected = `${creatorsURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                    if (creatorSelected.startsWith('http://')) {
                        creatorSelected = `https${creatorSelected.slice(4)}`
                    }
                    const response = await fetch(creatorSelected)
                    const json = await response.json()
                    marvel.renderCreators(json.data.results[0].id)
                })
            }
        }

        // Code to create list of comics
        {
            const eventsGalery_comicRailTemplate = document.getElementById('eventsGalery_comicRailTemplate')
            const eventsGalery_comicRail = document.getElementById('eventsGalery_comicRail')
            for (let index = 0; index < eventsSelected.comics.items.length; index++) {
                const comicFound = eventsSelected.comics.items[index];
                let tempNode = eventsGalery_comicRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (comicFound.name.length > 30) ? `${comicFound.name.slice(0,30)} ...` : `${comicFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `comicPicture${index}`)
                comicURI.push(comicFound.resourceURI)
                eventsGalery_comicRail.appendChild(htmlNode)
                func.$(`comicPicture${index}`).addEventListener("click" , async () => {
                    let comicSelected = `${comicURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                    if (comicSelected.startsWith('http://')) {
                        comicSelected = `https${comicSelected.slice(4)}`
                    }
                    const response = await fetch(comicSelected)
                    const json = await response.json()
                    marvel.renderComic(json.data.results[0].id)
                })
            }
        }

        // Code to create list of stories
        {
            const eventsGalery_storiesListTemplate = document.getElementById('eventsGalery_storiesListTemplate')
            const eventsGalery_storiesList = document.getElementById('eventsGalery_storiesList')
            for (let index = 0; index < eventsSelected.stories.items.length; index++) {
                const storiesFound = eventsSelected.stories.items[index];
                let tempNode = eventsGalery_storiesListTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_list_element__name').textContent = (storiesFound.name.length > 30) ? `${storiesFound.name.slice(0,30)} ...` : `${storiesFound.name}`
                storiesURI.push(storiesFound.resourceURI)
                eventsGalery_storiesList.appendChild(htmlNode)
            }
        }

        // Code to create list of series
        {
            const eventsGalery_seriesRailTemplate = document.getElementById('eventsGalery_seriesRailTemplate')
            const eventsGalery_seriesRail = document.getElementById('eventsGalery_seriesRail')
            for (let index = 0; index < eventsSelected.series.items.length; index++) {
                const seriesFound = eventsSelected.series.items[index];
                let tempNode = eventsGalery_seriesRailTemplate.content
                let htmlNode = document.importNode(tempNode,true)
                htmlNode.querySelector('.card_rail_element__name').textContent = (seriesFound.name.length > 30) ? `${seriesFound.name.slice(0,30)} ...` : `${seriesFound.name}`
                htmlNode.querySelector('.card_rail_element__thumbnail').setAttribute("id", `seriesPicture${index}`)
                seriesURI.push(seriesFound.resourceURI)
                eventsGalery_seriesRail.appendChild(htmlNode)
                func.$(`seriesPicture${index}`).addEventListener("click" , async () => {
                    let seriesSelected = `${seriesURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                    if (seriesSelected.startsWith('http://')) {
                        seriesSelected = `https${seriesSelected.slice(4)}`
                    }
                    const response = await fetch(seriesSelected)
                    const json = await response.json()
                    marvel.renderSeries(json.data.results[0].id)
                })
            }
        }

        // Code to add thumbnails to characters
        {
            for (let index = 0; index < charactersURI.length; index++) {
                let characterSelected = `${charactersURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                if (characterSelected.startsWith('http://')) {
                    characterSelected = `https${characterSelected.slice(4)}`
                }
                const response = await fetch(characterSelected)
                const json = await response.json()
                func.$(`charactersPicture${index}`).src = `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`
            }
        }

        // Code to add thumbnails to comics
        {
            for (let index = 0; index < comicURI.length; index++) {
                let comicSelected = `${comicURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
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
            for (let index = 0; index < seriesURI.length; index++) {
                let seriesSelected = `${seriesURI[index]}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
                if (seriesSelected.startsWith('http://')) {
                    seriesSelected = `https${seriesSelected.slice(4)}`
                }
                const response = await fetch(seriesSelected)
                const json = await response.json()
                func.$(`seriesPicture${index}`).src = `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`
            }
        }
    },
}

searchButton.addEventListener("click", ()=>{
    let hero = searchHeroBar.value
    marvel.createListOfCharacters(hero)
})

findRandomButton.addEventListener("click", ()=>{
    //INCOMPLETE CODE
    marvel.createListOfCharacters('a')
})

getAccessData()