import * as func from './modules/functions.js'

const searchHeroBar = document.getElementById('searchHeroBar')
const searchButton = document.getElementById('searchButton')
const findRandomButton = document.getElementById('findRandomButton')
const charThumbnail = document.getElementById('charThumbnail')
const charName = document.getElementById('charName')
const charDescription = document.getElementById('charDescription')
const characterGalery = document.getElementById('characterGalery')
const characterSearchResults = document.getElementById('characterSearchResults')
const templateSearchResults = document.getElementById('templateSearchResults')
const templateCharacterRender = document.getElementById('templateCharacterRender')




let ACCESSDATA
let ACCESSDATA_isLoaded = false

const getAccessData = async() => {
    await fetch("./js/json/APIaccessData.json")
        .then(res => res.json())
        .then(data => {
            ACCESSDATA = data
            ACCESSDATA_isLoaded = true
        })
}
getAccessData()

const marvel = {
    renderCharacter: async (name) => {
        const URLAPI = `https://gateway.marvel.com:443/v1/public/characters?${ACCESSDATA.tsAccess}&name=${name}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`;
        const response = await fetch(URLAPI)
        const json = await response.json()    
        const heroSelected = await json.data.results[0]

        let comicThumbnailsURI = []
        let seriesThumbnailsURI = []
        let storiesURI = []
        
        //Code to create page of character
        {
            characterSearchResults.innerHTML = ""
            characterGalery.innerHTML = ""
            console.log("HERO SELECTED: ", json)
            let tempNode = templateCharacterRender.content
            let htmlNode = document.importNode(tempNode,true)
            htmlNode.querySelector('.character_name').textContent = heroSelected.name
            htmlNode.querySelector('.character_thumbnail').setAttribute("src", `${heroSelected.thumbnail.path}.${heroSelected.thumbnail.extension}`)
            htmlNode.querySelector('.character_description').textContent = heroSelected.description
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
                htmlNode.querySelector('.comic_container__name').textContent = (comicFound.name.length > 30) ? `${comicFound.name.slice(0,30)} ...` : `${comicFound.name}`
                htmlNode.querySelector('.comic_container__thumbnail').setAttribute("id", `comicPicture${index}`)
                comicThumbnailsURI.push(comicFound.resourceURI)
                comicsRail.appendChild(htmlNode)
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
                htmlNode.querySelector('.series_container__name').textContent = (seriesFound.name.length > 30) ? `${seriesFound.name.slice(0,30)} ...` : `${seriesFound.name}`
                htmlNode.querySelector('.series_container__thumbnail').setAttribute("id", `seriesPicture${index}`)
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
                htmlNode.querySelector('.stories_container__name').textContent = (storiesFound.name.length > 30) ? `${storiesFound.name.slice(0,30)} ...` : `${storiesFound.name}`
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
                console.log(comicSelected)
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
                console.log(seriesSelected)
                const response = await fetch(seriesSelected)
                const json = await response.json()
                func.$(`seriesPicture${index}`).src = `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`
            }
        }
    },
    createListOfCharacters: (startsWith) => {
        const URLAPI = `https://gateway.marvel.com:443/v1/public/characters?${ACCESSDATA.tsAccess}&nameStartsWith=${startsWith}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`;
        fetch(URLAPI)
            .then (res => res.json())
            .then (json => {
                console.log(json)
                //Code to create list of results
                {
                    characterSearchResults.innerHTML = ""
                    characterGalery.innerHTML = ""
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
            })
    }
}

searchButton.addEventListener("click", ()=>{
    let hero = searchHeroBar.value
    marvel.createListOfCharacters(hero)
})