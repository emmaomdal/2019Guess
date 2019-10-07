import {getText} from "./language.js";

const LAN_KEY = {
    GUESS: "GUESS",
    YOUR_GUESS: "YOUR_GUESS",
    USER_NAME: "USER_NAME",
    START_JOIN: "START_JOIN",
    PLAYERS_PLAYING: "PLAYERS_PLAYING"
};

const nameInput = document.getElementById("userName");
const guessInput = document.getElementById("guess");

let guessBtn = document.getElementById("btn1");
let startBtn = document.getElementById("btn2");
let output = document.getElementById("output");
let nbPlayers = document.getElementById("nbPlayers");
let userLang = navigator.language || navigator.userLanguage;

language();

function language() {
    let usernameLabel = document.getElementById("userNameLabel");
    let guessLabel = document.getElementById("guessLabel");

    usernameLabel.innerText = getText(LAN_KEY.USER_NAME, userLang);
    guessLabel.innerText = getText(LAN_KEY.YOUR_GUESS, userLang);
    startBtn.innerText = getText(LAN_KEY.START_JOIN, userLang);
    guessBtn.innerText = getText(LAN_KEY.GUESS, userLang);
}

async function requestToServer(path, content) {
    return fetch(path, content).then(resp => {
        console.log(resp);
        if (resp.ok) {
            return resp.json();
        }
    });
}
if (startBtn) {
    startBtn.addEventListener('click', (evt) => {
        if (nameInput) {
            const name = nameInput.value;

            if (name.length > 0) {
                guessBtn.disabled = false;

                requestToServer(`http://localhost:8000/start/${name}`, {}).then(json => {
                    console.log(json);
                    guessInput.min = json.min;
                    guessInput.max = json.max;
                    nbPlayers.innerText = json.users + " players";
                });
            }
        }
    });
}

if (guessBtn) {
    guessBtn.addEventListener('click', (evt) => {
        if (nameInput && guessInput) {
            const name = nameInput.value;
            const guess = guessInput.value;

            if (name.length > 0 && guess) {
                requestToServer(`http://localhost:8000/guess/${name}/${guess}`, {
                    method: "POST",
                    headers: {
                        "accept": "application/json",
                        "content-type": "application/json",
                        "accept-language": userLang
                    }
                }).then(json => {
                    console.log(json);
                    output.innerText = json.msg;
                    nbPlayers.innerText = json.users + " player" + (json.users > 1 ? "s" : "");
                });
            }
        }
    });
}
