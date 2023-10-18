function runScript() {
    let g5IntNoteTaker = {};
    g5IntNoteTaker.userName = localStorage.getItem('g5IntNoteTaker.userName');
    if (!g5IntNoteTaker.userName) {
        g5IntNoteTaker.userName = prompt('Please enter your name how you want it to appear in notes: (Ex: John D)');
        if (g5IntNoteTaker.userName) {
            localStorage.setItem('g5IntNoteTaker.userName', g5IntNoteTaker.userName);
        } else {
            alert('You must enter your name for this bookmarklet to work.');
            return;
        }
    }

    let integrationType;
    let integrationTypeH2 = document.querySelector('div.row.main > div > h2');
    if (integrationTypeH2.innerHTML.toLowerCase().includes('marketing center')) {
        integrationType = 'Marketing Center';
    }
    console.log('Started note taker for G5 Integrations Dashboard.');
    let integrationForm = document.querySelector('div.row:last-of-type > div > div.form-horizontal');
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
            let locationObj;
            if (integrationType === 'Marketing Center') {
                locationObj = {
                    name: location.querySelector(':scope > div:first-child > label').innerHTML,
                    internalName: location.querySelector(':scope > div:nth-child(2) > label').innerHTML,
                    lspid: location.querySelector(':scope > div:nth-child(3) > input').value,
                    partnerpid: location.querySelector(':scope > div:nth-child(4) > input').value
                };
                if (locationObj.lspid.length > 0 && locationObj.partnerpid.length > 0) {
                    locationObjs.push(locationObj);
                }
            } else {
                locationObj = {
                    name: location.querySelector(':scope > div:first-child > label').innerHTML,
                    internalName: location.querySelector(':scope > div:nth-child(2) > label').innerHTML,
                    id: location.querySelector(':scope > div:nth-child(3) > input').value
                };
                if (locationObj.id.length > 0) {
                    locationObjs.push(locationObj);
                }
            }
        });
        console.log(locationObjs);
        window.alert(`Added notes for ${locationObjs.length} location(s).`);
        locationObjs.forEach((location) => {
            let notePt1 = `${currentDate} ${g5IntNoteTaker.userName} - Added: ${location.name} `;
            let notePt2 = `(id: ${location.id}).`;
            if (integrationType === 'Marketing Center') {
                notePt2 = `(lspid: ${location.lspid} | partnerpid: ${location.partnerpid}).`;
            }
            let note = `${notePt1}${notePt2}`;
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

    function allNotSavedLocations() {
        let locations = integrationForm.querySelectorAll('.form-group:not(:first-child):not(.has-location-code)');
        createNotes(locations);
    }

    let validInput = true;
    function getUserInput() {
        let userInput;
        if (validInput) {
            userInput = window.prompt('What location(s) would you like to make notes for?\n(1) For all locations with codes and that have been saved.\n(2) For all selected locations.\n(3) For all locations with location codes.\n(4) For all locations with location codes, but not saved.');
        }
        if (userInput == 1) {
            allSavedLocations();
        } else if (userInput == 2) {
            selectedLocations();
        } else if (userInput == 3) {
            allLocations();
        } else if (userInput == 4) {
            allNotSavedLocations();
        } else if (userInput === null) {
            return;
        } else {
            userInput = window.prompt('Detected an invalid input. Please select from the following options:\n(1) For all locations with codes and that have been saved.\n(2) For all selected locations.\n(3) For all locations with location codes.\n(4) For all locations with location codes, but not saved.');
            validInput = false;
            getUserInput();
        }
    }
    getUserInput();
}
const g5IntDashUrlRegex = /^https:\/\/integrations\.g5marketingcloud\.com\/client_vendor_settings\/.*\/edit$|^https:\/\/integrations\.g5marketingcloud\.com\/client_vendor_settings\/new\?.*$/;
g5IntDashUrlRegex.test(window.location.href) ? runScript() : window.alert("You must be in the G5 Integrations Dashboard and have a Client Vendor Settings (CVS) page open in order to run this script.");
