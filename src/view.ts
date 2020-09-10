/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IDiceRoller } from "./dataObject";

let downState : {x:number, y:number, left:number, top:number} | null;
let _diceRoller : IDiceRoller | null = null;

function pointerDown(evt : PointerEvent) {
    let target : HTMLElement = <HTMLElement>evt.target;
    target.setPointerCapture(evt.pointerId);
    let left = parseFloat(target.style.getPropertyValue("left"));
    let top = parseFloat(target.style.getPropertyValue("top"));
    downState = {x: evt.clientX, y: evt.clientX, left: left, top: top};
    target.addEventListener("pointermove", pointerMove);
    target.addEventListener("pointerup", pointerUp);
}

function pointerMove(evt : PointerEvent) {
    if (!downState) {return;}
    // let target : HTMLElement = <HTMLElement>evt.target;
    let diffX = evt.clientX - downState.x;
    let diffY = evt.clientY - downState.y;
    let left = downState.left + diffX;
    let top = downState.top + diffY;
    // target.style.setProperty("left", left + "px");
    // target.style.setProperty("top", top + "px");
    if (_diceRoller) {
        _diceRoller.move(left, top);
    }
}

function pointerUp(evt : PointerEvent) {
    downState = null;
    let target : HTMLElement = <HTMLElement>evt.target;
    target.releasePointerCapture(evt.pointerId);
    target.removeEventListener("pointermove", pointerMove);
    target.removeEventListener("pointerup", pointerUp);
}

/**
 * Render an IDiceRoller into a given div as a text character, with a button to roll it.
 * @param diceRoller - The Data Object to be rendered
 * @param div - The div to render into
 */
export function renderDiceRoller(diceRoller: IDiceRoller, div: HTMLDivElement) {
    _diceRoller = diceRoller;
    const wrapperDiv = document.createElement("div");
    wrapperDiv.style.textAlign = "center";
    div.append(wrapperDiv);

    const diceCharDiv = document.createElement("div");
    diceCharDiv.style.fontSize = "200px";
    diceCharDiv.style.position = "absolute";
    diceCharDiv.style.left = "10px";
    diceCharDiv.style.top = "10px";
    diceCharDiv.style.setProperty("user-select", "none");

    const rollButton = document.createElement("button");
    rollButton.style.fontSize = "50px";
    rollButton.textContent = "Roll";
    // Call the roll method to modify the shared data when the button is clicked.
    rollButton.addEventListener("click", diceRoller.roll);

    wrapperDiv.append(diceCharDiv/* , rollButton */);

    // Get the current value of the shared data to update the view whenever it changes.
    const updateDiceChar = () => {
        // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
        diceCharDiv.textContent = String.fromCodePoint(0x267F + diceRoller.value);
        diceCharDiv.style.color = `hsl(${diceRoller.value * 60}, 70%, 50%)`;
    };
    updateDiceChar();

    const updateDicePosition = () => {
        let pos = diceRoller.position
        diceCharDiv.style.setProperty("left", pos.x + "px");
        diceCharDiv.style.setProperty("top", pos.y + "px");
    }

    // Use the diceRolled event to trigger the rerender whenever the value changes.
    diceRoller.on("diceRolled", updateDiceChar);

    diceRoller.on("diceMoved", updateDicePosition);

    diceCharDiv.addEventListener("pointerdown", pointerDown);
}
