"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Store = require('electron-store');
const storageSaves = new Store({ name: 'saves', cwd: 'storage' });
// Fetch the save ID and game ID for saving
const gameId = window.localStorage.getItem('gameId');
const saveId = window.localStorage.getItem('saveId');
console.log('Game ID / Save ID', gameId, saveId);
// Check if game ID or save ID is undefined
if (!gameId || !saveId) {
    console.warn('Game ID or save ID missing!');
}
displaySaveInfo();
async function displaySaveInfo() {
    try {
        const saveInfo = await storageSaves.get(`games.${gameId}.${saveId}`);
        console.log('Fetched save information', saveInfo);
        // Display the name of the save
        document.getElementById('saveName').innerHTML = saveInfo.name;
        console.log('Displayed save name');
        // Display boss information
        const saveInfoElement = document.getElementById('saveInfo');
        Object.values(saveInfo.bosses).forEach((bossInfo) => {
            const liParent = document.createElement('li');
            const ul = document.createElement('ul');
            const liBossName = document.createElement('li');
            const liBossTime = document.createElement('li');
            // Put boss name into a text node and append it to the boss name li
            const bossName = document.createTextNode(`Name: ${bossInfo.name}`);
            liBossName.appendChild(bossName);
            // Put time into a text node and append it to the time li
            const bossTime = document.createTextNode(`Time: ${bossInfo.time}`);
            liBossTime.appendChild(bossTime);
            saveInfoElement.appendChild(liParent);
            liParent.appendChild(ul);
            ul.appendChild(liBossName);
            ul.appendChild(liBossTime);
        });
        console.log('Displayed save information');
    }
    catch (err) {
        console.error('Error while displaying save information:', err);
    }
}
//# sourceMappingURL=overlay.js.map