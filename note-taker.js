let name = 'Lake S';
console.log('Started note taker for Marketing Center integrations.');
let formHeaders = document.querySelectorAll('div.form-horizontal > div.form-group:first-child');
let integrationForm;
formHeaders.forEach((header) => {
    for (let i = 0; i < header.children.length; i++) {
        if (header.children[i].querySelector('label')) {
            if (header.children[i].querySelector('label').innerHTML.toLowerCase().includes('leasestar property')) {
                integrationForm = header.parentElement;
            }
        }
    }
});

let inventoryNotesField;
let leadsNotesField;
function getNotesFields() {
    let panels = document.querySelectorAll('div.panel.panel-default');
    panels.forEach((panel) => {
        if (panel.querySelector('.panel-heading > .panel-title')) {
            if (panel.querySelector('.panel-heading > .panel-title').innerHTML.toLowerCase().includes('notes')) {
                let noteDivs = panel.querySelectorAll('.panel-body > fieldset div.form-group');
                for (let i = 0; i < noteDivs.length; i++) {
                    let noteLabel = noteDivs[i].querySelector('label').innerHTML;
                    if (noteLabel.toLowerCase().includes('inventory')) {
                        inventoryNotesField = noteDivs[i].querySelector('textarea');
                    } else if (noteLabel.toLowerCase().includes('leads')) {
                        leadsNotesField = noteDivs[i].querySelector('textarea');
                    }
                }
            }
        }
    });
}
getNotesFields();

function createNotes(noteLocations) {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let year = date.getFullYear().toString().slice(-2);
    let currentDate = `${month}/${day}/${year}`;

    let locationObjs = [];
    noteLocations.forEach((location) => {
        let locationObj = {
            name: location.querySelector(':scope > div:first-child > label').innerHTML,
            internalName: location.querySelector(':scope > div:nth-child(2) > label').innerHTML,
            lspid: location.querySelector(':scope > div:nth-child(3) > input').value,
            partnerpid: location.querySelector(':scope > div:nth-child(4) > input').value
        };
        if (locationObj.lspid.length > 0 && locationObj.partnerpid.length > 0) {
            locationObjs.push(locationObj);
        }
    });
    console.log(locationObjs);
    locationObjs.forEach((location) => {
        let note = `${currentDate} ${name} - Added: ${location.name} (lspid: ${location.lspid} | partnerpid: ${location.partnerpid}).`;
        if (inventoryNotesField.value.length > 0) {
            inventoryNotesField.value = `${note}\n${inventoryNotesField.value}`;
        } else {
            inventoryNotesField.value = `${note}`;
        }
    });
}

function allSavedLocations() {
    let locations = integrationForm.querySelectorAll('div.form-group.has-location-code');
    createNotes(locations);
}

function selectedLocations() {
    let locations = integrationForm.querySelectorAll('.form-group.move-selected');
    createNotes(locations);
}

function allLocations() {
    let locations = integrationForm.querySelectorAll('.form-group:not(:first-child)');
    createNotes(locations);
}

let validInput = true;
function getUserInput() {
    let userInput;
    if (validInput) {
        userInput = window.prompt('What location(s) would you like to make notes for?\n(1) For all locations with codes and that have been saved.\n(2) For all selected locations.\n(3) For all locations with location codes.');
    }
    if (userInput == 1) {
        allSavedLocations();
    } else if (userInput == 2) {
        selectedLocations();
    } else if (userInput == 3) {
        allLocations();
    } else if (userInput === null) {
        return;
    } else {
        userInput = window.prompt('Detected an invalid input. Please select from the following options:\n(1) For all locations with codes and that have been saved.\n(2) For all selected locations.\n(3) For all locations with location codes.');
        validInput = false;
        getUserInput();
    }
}
getUserInput();
