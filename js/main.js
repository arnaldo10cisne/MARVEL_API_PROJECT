import * as func from './modules/functions.js'
import * as elem from './modules/elements.js'

let ACCESSDATA
(async () => {
    ACCESSDATA = await func.getAccessData()
})()

const marvel = {
    createListOfCharacters: async (startsWith) => {
        const URLAPI = `https://gateway.marvel.com:443/v1/public/characters?${ACCESSDATA.tsAccess}&nameStartsWith=${startsWith}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`;
        const response = await fetch(URLAPI)
        const json = await response.json()
        
        // Code to create list of possible choices
        {
            func.cleanGuidebook()
            if (json.data.results.length == 1) {
                marvel.renderCharacter(json.data.results[0].id)
            } else {
                for (let index = 0; index < json.data.results.length; index++) {
                    const heroFound = json.data.results[index];
                    let tempNode = elem.templateSearchResults.content
                    let htmlNode = document.importNode(tempNode,true)
                    htmlNode.querySelector('.character_search_result__container__name').textContent = heroFound.name
                    htmlNode.querySelector('.character_search_result__picture').setAttribute("src", `${heroFound.thumbnail.path}.${heroFound.thumbnail.extension}`)
                    htmlNode.querySelector('.character_search_result__container').setAttribute("id", `resultID${index}`)
                    elem.characterSearchResults.appendChild(htmlNode)
                    func.$(`resultID${index}`).addEventListener("click" , () => {
                        marvel.renderCharacter(heroFound.id)
                    })
                }
            }
        }
    },
    renderCharacter: async (id) => {
        
        const URLAPI = `https://gateway.marvel.com:443/v1/public/characters/${id}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
        const response = await fetch(URLAPI)
        const json = await response.json()    
        const heroSelected = await json.data.results[0]

        let comicURI = []
        let seriesURI = []
        let storiesURI = []
        
        func.renderMainInfo(elem.templateCharacterRender, heroSelected, elem.characterGalery, 1)

        func.renderElementsStructure(
            elem.charactersGalery_comicRailTemplate, 
            'charactersGalery_comicRailTemplate', 
            elem.charactersGalery_comicsRail, 
            'charactersGalery_comicsRail', 
            heroSelected.comics.items, 
            'comicPicture', 
            comicURI, 
            marvel.renderComic, 
            ACCESSDATA,
            'rail')
        
        func.renderElementsStructure(
            elem.charactersGalery_seriesRailTemplate, 
            'charactersGalery_seriesRailTemplate', 
            elem.charactersGalery_seriesRail, 
            'charactersGalery_seriesRail', 
            heroSelected.series.items, 
            'seriesPicture', 
            seriesURI, 
            marvel.renderSeries, 
            ACCESSDATA,
            'rail')

        func.renderElementsStructure(
            elem.charactersGalery_storiesListTemplate, 
            'charactersGalery_storiesListTemplate', 
            elem.charactersGalery_storiesList, 
            'charactersGalery_storiesList', 
            heroSelected.stories.items, 
            'storiesLink', 
            storiesURI, 
            marvel.renderStories, 
            ACCESSDATA,
            'list')
        
        func.renderImages(comicURI, 'comicPicture', ACCESSDATA)

        func.renderImages(seriesURI, 'seriesPicture', ACCESSDATA)
        
    },
    renderComic: async (id) => {

        const URLAPI = `https://gateway.marvel.com:443/v1/public/comics/${id}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
        const response = await fetch(URLAPI)
        const json = await response.json()    
        const comicSelected = await json.data.results[0]

        let charactersURI = []
        let creatorsURI = []
        let storiesURI = []
        let seriesURI = []

        func.renderMainInfo(elem.templateComicRender, comicSelected, elem.comicGalery, 3)

        func.renderElementsStructure(
            elem.comicGalery_charactersRailTemplate, 
            'comicGalery_charactersRailTemplate', 
            elem.comicGalery_charactersRail, 
            'comicGalery_charactersRail', 
            comicSelected.characters.items, 
            'charactersPicture', 
            charactersURI, 
            marvel.renderCharacter, 
            ACCESSDATA,
            'rail')

        func.renderElementsStructure(
            elem.comicGalery_creatorsListTemplate, 
            'comicGalery_creatorsListTemplate', 
            elem.comicGalery_creatorsList, 
            'comicGalery_creatorsList', 
            comicSelected.creators.items, 
            'creatorsLink', 
            creatorsURI, 
            marvel.renderCreators, 
            ACCESSDATA,
            'list')

        func.renderElementsStructure(
            elem.comicGalery_seriesRailTemplate, 
            'comicGalery_seriesRailTemplate', 
            elem.comicGalery_seriesRail, 
            'comicGalery_seriesRail', 
            [comicSelected.series], 
            'seriesPicture', 
            seriesURI, 
            marvel.renderSeries, 
            ACCESSDATA,
            'rail')

        func.renderElementsStructure(
            elem.comicGalery_storiesListTemplate, 
            'comicGalery_storiesListTemplate', 
            elem.comicGalery_storiesList, 
            'comicGalery_storiesList', 
            comicSelected.stories.items, 
            'storiesLink', 
            storiesURI, 
            marvel.renderStories, 
            ACCESSDATA,
            'list')

        func.renderImages(charactersURI, 'charactersPicture', ACCESSDATA)

        func.renderImages(seriesURI, 'seriesPicture', ACCESSDATA)
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

        func.renderMainInfo(elem.templateCreatorsRender, creatorSelected, elem.creatorsGalery, 2)

        func.renderElementsStructure(
            elem.creatorsGalery_comicsRailTemplate, 
            'creatorsGalery_comicsRailTemplate', 
            elem.creatorsGalery_comicsRail, 
            'creatorsGalery_comicsRail', 
            creatorSelected.comics.items, 
            'comicPicture', 
            comicURI, 
            marvel.renderComic, 
            ACCESSDATA,
            'rail')

        func.renderElementsStructure(
            elem.creatorsGalery_seriesRailTemplate, 
            'creatorsGalery_seriesRailTemplate', 
            elem.creatorsGalery_seriesRail, 
            'creatorsGalery_seriesRail', 
            creatorSelected.series.items, 
            'seriesPicture', 
            seriesURI, 
            marvel.renderSeries, 
            ACCESSDATA,
            'rail')

        func.renderElementsStructure(
            elem.creatorsGalery_storiesListTemplate, 
            'creatorsGalery_storiesListTemplate', 
            elem.creatorsGalery_storiesList, 
            'creatorsGalery_storiesList', 
            creatorSelected.stories.items, 
            'storiesLink', 
            storiesURI, 
            marvel.renderStories, 
            ACCESSDATA,
            'list')

        func.renderElementsStructure(
            elem.creatorsGalery_eventsRailTemplate, 
            'creatorsGalery_eventsRailTemplate', 
            elem.creatorsGalery_eventsRail, 
            'creatorsGalery_eventsRail', 
            creatorSelected.events.items, 
            'eventsPicture', 
            eventsURI, 
            marvel.renderEvents, 
            ACCESSDATA,
            'rail')
        
        func.renderImages(comicURI, 'comicPicture', ACCESSDATA)

        func.renderImages(seriesURI, 'seriesPicture', ACCESSDATA)
        
        func.renderImages(eventsURI, 'eventsPicture', ACCESSDATA)

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
        
        func.renderMainInfo(elem.templateSeriesRender, seriesSelected, elem.seriesGalery, 3)

        func.renderElementsStructure(
            elem.seriesGalery_charactersRailTemplate, 
            'seriesGalery_charactersRailTemplate', 
            elem.seriesGalery_charactersRail, 
            'seriesGalery_charactersRail', 
            seriesSelected.characters.items, 
            'charactersPicture', 
            charactersURI, 
            marvel.renderCharacter, 
            ACCESSDATA,
            'rail')

        func.renderElementsStructure(
            elem.seriesGalery_creatorsListTemplate, 
            'seriesGalery_creatorsListTemplate', 
            elem.seriesGalery_creatorsList, 
            'seriesGalery_creatorsList', 
            seriesSelected.creators.items, 
            'creatorsLink', 
            creatorsURI, 
            marvel.renderCreators, 
            ACCESSDATA,
            'list')

        func.renderElementsStructure(
            elem.seriesGalery_comicRailTemplate, 
            'seriesGalery_comicRailTemplate', 
            elem.seriesGalery_comicRail, 
            'seriesGalery_comicRail', 
            seriesSelected.comics.items, 
            'comicPicture', 
            comicURI, 
            marvel.renderComic, 
            ACCESSDATA,
            'rail')

        func.renderElementsStructure(
            elem.seriesGalery_storiesListTemplate, 
            'seriesGalery_storiesListTemplate', 
            elem.seriesGalery_storiesList, 
            'seriesGalery_storiesList', 
            seriesSelected.stories.items, 
            'comicPicture', 
            storiesURI, 
            marvel.renderStories, 
            ACCESSDATA,
            'list')

        func.renderElementsStructure(
            elem.seriesGalery_eventsRailTemplate, 
            'seriesGalery_eventsRailTemplate', 
            elem.seriesGalery_eventsRail, 
            'seriesGalery_eventsRail', 
            seriesSelected.events.items, 
            'eventsPicture', 
            eventsURI, 
            marvel.renderEvents, 
            ACCESSDATA,
            'rail')

        func.renderImages(charactersURI, 'charactersPicture', ACCESSDATA)

        func.renderImages(comicURI, 'comicPicture', ACCESSDATA)

        func.renderImages(eventsURI, 'eventsPicture', ACCESSDATA)
    },
    renderStories: async (id) =>{
        
        const URLAPI = `https://gateway.marvel.com:443/v1/public/stories/${id}?${ACCESSDATA.tsAccess}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`
        const response = await fetch(URLAPI)
        const json = await response.json()    
        const storiesSelected = await json.data.results[0]

        let charactersURI = []
        let creatorsURI = []
        let seriesURI = []
        let comicURI = []
        let eventsURI = []
        
        func.renderMainInfo(elem.templateStoriesRender, storiesSelected, elem.storiesGalery, 3)

        func.renderElementsStructure(
            elem.storiesGalery_charactersRailTemplate, 
            'storiesGalery_charactersRailTemplate', 
            elem.storiesGalery_charactersRail, 
            'storiesGalery_charactersRail', 
            storiesSelected.characters.items, 
            'charactersPicture', 
            charactersURI, 
            marvel.renderCharacter, 
            ACCESSDATA,
            'rail')

        func.renderElementsStructure(
            elem.storiesGalery_creatorsListTemplate, 
            'storiesGalery_creatorsListTemplate', 
            elem.storiesGalery_creatorsList, 
            'storiesGalery_creatorsList', 
            storiesSelected.creators.items, 
            'creatorsLink', 
            creatorsURI, 
            marvel.renderCreators, 
            ACCESSDATA,
            'list')

        func.renderElementsStructure(
            elem.storiesGalery_comicRailTemplate, 
            'storiesGalery_comicRailTemplate', 
            elem.storiesGalery_comicRail, 
            'storiesGalery_comicRail', 
            storiesSelected.comics.items, 
            'comicPicture', 
            comicURI, 
            marvel.renderComic, 
            ACCESSDATA,
            'rail')

        func.renderElementsStructure(
            elem.storiesGalery_seriesRailTemplate, 
            'storiesGalery_seriesRailTemplate', 
            elem.storiesGalery_seriesRail, 
            'storiesGalery_seriesRail', 
            storiesSelected.series.items, 
            'seriesPicture', 
            seriesURI, 
            marvel.renderSeries, 
            ACCESSDATA,
            'rail')

        func.renderElementsStructure(
            elem.storiesGalery_eventsRailTemplate, 
            'storiesGalery_eventsRailTemplate', 
            elem.storiesGalery_eventsRail, 
            'storiesGalery_eventsRail', 
            storiesSelected.events.items, 
            'eventsPicture', 
            eventsURI, 
            marvel.renderEvents, 
            ACCESSDATA,
            'rail')

        func.renderImages(charactersURI, 'charactersPicture', ACCESSDATA)

        func.renderImages(comicURI, 'comicPicture', ACCESSDATA)
    
        func.renderImages(seriesURI, 'seriesPicture', ACCESSDATA)
        
        func.renderImages(eventsURI, 'eventsPicture', ACCESSDATA)
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
        
        func.renderMainInfo(elem.templateEventsRender, eventsSelected, elem.eventsGalery, 3)

        func.renderElementsStructure(
            elem.eventsGalery_charactersRailTemplate, 
            'eventsGalery_charactersRailTemplate', 
            elem.eventsGalery_charactersRail, 
            'eventsGalery_charactersRail', 
            eventsSelected.characters.items, 
            'charactersPicture', 
            charactersURI, 
            marvel.renderCharacter, 
            ACCESSDATA,
            'rail')

        func.renderElementsStructure(
            elem.eventsGalery_creatorsListTemplate, 
            'eventsGalery_creatorsListTemplate', 
            elem.eventsGalery_creatorsList, 
            'eventsGalery_creatorsList', 
            eventsSelected.creators.items, 
            'creatorsLink', 
            creatorsURI, 
            marvel.renderCreators, 
            ACCESSDATA,
            'list')

        func.renderElementsStructure(
            elem.eventsGalery_comicRailTemplate, 
            'eventsGalery_comicRailTemplate', 
            elem.eventsGalery_comicRail, 
            'eventsGalery_comicRail', 
            eventsSelected.comics.items, 
            'comicPicture', 
            comicURI, 
            marvel.renderComic, 
            ACCESSDATA,
            'rail')

        func.renderElementsStructure(
            elem.eventsGalery_storiesListTemplate, 
            'eventsGalery_storiesListTemplate', 
            elem.eventsGalery_storiesList, 
            'eventsGalery_storiesList', 
            eventsSelected.stories.items, 
            'storiesLink', 
            storiesURI, 
            marvel.renderStories, 
            ACCESSDATA,
            'list')

        func.renderElementsStructure(
            elem.eventsGalery_seriesRailTemplate, 
            'eventsGalery_seriesRailTemplate', 
            elem.eventsGalery_seriesRail, 
            'eventsGalery_seriesRail', 
            eventsSelected.series.items, 
            'seriesPicture', 
            seriesURI, 
            marvel.renderSeries, 
            ACCESSDATA,
            'rail')

        func.renderImages(charactersURI, 'charactersPicture', ACCESSDATA)

        func.renderImages(comicURI, 'comicPicture', ACCESSDATA)

        func.renderImages(seriesURI, 'seriesPicture', ACCESSDATA)
    },
}

elem.searchButton.addEventListener("click", ()=>{
    let hero = elem.searchHeroBar.value
    marvel.createListOfCharacters(hero)
})

elem.findRandomButton.addEventListener("click", ()=>{
    //INCOMPLETE CODE
    marvel.createListOfCharacters('a')
})