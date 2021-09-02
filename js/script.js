const searchHeroBar = document.getElementById('searchHeroBar')
const searchButton = document.getElementById('searchButton')
const findRandomButton = document.getElementById('findRandomButton')
const charThumbnail = document.getElementById('charThumbnail')
const charName = document.getElementById('charName')
const charDescription = document.getElementById('charDescription')

let PRIVATEDATA
let PRIVATEDATA_isLoaded = false

const getPrivateData = async() => {
    await fetch("./js/json/privateData.json")
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
    let contentHTML = '';
    fetch(URLAPI)
        .then (res => res.json())
        .then((json) => {
            console.log("RES JSON: ", json)
            charName.innerHTML = json.data.results[0].name
            charThumbnail.style.backgroundImage = `url(${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension})`
            charDescription.innerHTML = json.data.results[0].description
        })
    }
}

searchButton.addEventListener("click", ()=>{
    let hero = searchHeroBar.value
    marvel.renderCharacter(hero)
})