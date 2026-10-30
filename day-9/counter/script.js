const countDisplay = document.querySelector("#count");
const countCaption = document.querySelector("#count-caption");
const increaseButton = document.querySelector("#increase");
const decreaseButton = document.querySelector("#decrease");
const resetButton = document.querySelector("#reset");
const yearDisplay = document.querySelector("#year");

let count = 0;

function renderCount() {
    countDisplay.value = count;
    countCaption.textContent =
        count === 0 ? "A fresh start." : count === 1 ? "Look at you go." : "Every little bit counts.";
}

increaseButton.addEventListener("click", () => {
    count += 1;
    renderCount();
});

decreaseButton.addEventListener("click", () => {
    count -= 1;
    renderCount();
});

resetButton.addEventListener("click", () => {
    count = 0;
    renderCount();
});

yearDisplay.textContent = new Date().getFullYear();
