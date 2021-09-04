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
    renderCharacter: (name) => {
        const URLAPI = `https://gateway.marvel.com:443/v1/public/characters?${ACCESSDATA.tsAccess}&name=${name}&apikey=${ACCESSDATA.publicKey}&${ACCESSDATA.md5HashAccess}`;
        fetch(URLAPI)
            .then (res => res.json())
            .then((json) => {
                const heroSelected = json.data.results[0]
                //Code to create page of character
                {
                    characterSearchResults.innerHTML = ""
                    characterGalery.innerHTML = ""
                    console.log("RES JSON: ", json)
                    let tempNode = templateCharacterRender.content
                    let htmlNode = document.importNode(tempNode,true)
                    htmlNode.querySelector('.character_name').textContent = heroSelected.name
                    htmlNode.querySelector('.character_thumbnail').setAttribute("src", `${heroSelected.thumbnail.path}.${heroSelected.thumbnail.extension}`)
                    htmlNode.querySelector('.character_description').textContent = heroSelected.description
                    characterGalery.appendChild(htmlNode)
                }
            })
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