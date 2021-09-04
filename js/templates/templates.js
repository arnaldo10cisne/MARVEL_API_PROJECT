export const createHeroDisplay = (charName, description, thumbnailURL) => {
    return `
    <div class="character_container">
        <img id="charThumbnail" class="character_thumbnail" src="${thumbnailURL}" alt="${charName} thumbnail"> 
        <span id="charName" class="character_name">${charName}</span>
        <p id="charDescription" class="character_description">${description}</p>
    </div>
    `
}

export const characterSearchResult = (resultid, charName, thumbnailURL) => {
    return `
    <div id="resultID${resultid}" class="character_search_result__container">
        <div class="character_search_result__picture_container"><img class="character_search_result__container__picture" src="${thumbnailURL}" alt=""></div>
        <span class="character_search_result__container__name">${charName}</span>
    </div>
    `
}