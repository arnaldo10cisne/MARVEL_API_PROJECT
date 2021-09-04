import * as template from './templates/templates.js'
import * as func from './modules/functions.js'

const searchHeroBar = document.getElementById('searchHeroBar')
const searchButton = document.getElementById('searchButton')
const findRandomButton = document.getElementById('findRandomButton')
const charThumbnail = document.getElementById('charThumbnail')
const charName = document.getElementById('charName')
const charDescription = document.getElementById('charDescription')
const characterGalery = document.getElementById('characterGalery')
const characterSearchResults = document.getElementById('characterSearchResults')

let PRIVATEDATA
let PRIVATEDATA_isLoaded = false

const getPrivateData = async() => {
    await fetch("./js/json/APIaccessData.json")
        .then(res => res.json())
        .then(data => {
            PRIVATEDATA = data
            PRIVATEDATA_isLoaded = true
        })
}
getPrivateData()

const marvel = {
    renderCharacter: (name) => {
        const URLAPI = `https://gateway.marvel.com:443/v1/public/characters?${PRIVATEDATA.tsAccess}&name=${name}&apikey=${PRIVATEDATA.publicKey}&${PRIVATEDATA.md5HashAccess}`;
        //let contentHTML = '';
        fetch(URLAPI)
            .then (res => res.json())
            .then((json) => {
                //Code to create page of character
                characterSearchResults.innerHTML = ""
                console.log("RES JSON: ", json)
                characterGalery.innerHTML = template.createHeroDisplay(json.data.results[0].name, json.data.results[0].description, `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`)
            })
    },
    createListOfCharacters: (startsWith) => {
        const URLAPI = `https://gateway.marvel.com:443/v1/public/characters?${PRIVATEDATA.tsAccess}&nameStartsWith=${startsWith}&apikey=${PRIVATEDATA.publicKey}&${PRIVATEDATA.md5HashAccess}`;
        fetch(URLAPI)
            .then (res => res.json())
            .then (json => {
                console.log(json)
                //Code to create list of results
                {
                    characterSearchResults.innerHTML = ""
                    for (let index = 0; index < json.data.results.length; index++) {
                        const heroFound = json.data.results[index];
                        characterSearchResults.innerHTML = characterSearchResults.innerHTML + template.characterSearchResult(index, heroFound.name, `${heroFound.thumbnail.path}.${heroFound.thumbnail.extension}`)
                        // func.$(`resultID${index}`).addEventListener("click", () => {
                        //     alert(`Click on ID ${index}`)
                        //     console.log('Hola')
                        // })
                    }
                    
                }
            })
    }
}

searchButton.addEventListener("click", ()=>{
    let hero = searchHeroBar.value
    marvel.createListOfCharacters(hero)
})