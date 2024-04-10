//Board clicks handler
function boardClickHandler(event) {
    if (event.target.closest(".list__addItem")) return addNewItemTextarea(event);
    if (event.target.className == 'list-addList') {
        document.querySelector(".list-add").insertAdjacentHTML("beforebegin", listItem);
    }
}
document.querySelector(".board").addEventListener("click", boardClickHandler);

// Add a list

let listItem = `<li class="list-wrapper">
<div class="list">
    <header class="list__header">
        <h2 class="list__name">List name</h2>
        <button class="list__settings">
            <img class="icon" src="imgs/list-settings-dots.png">
        </button>
    </header>
    <ol class="list__items"></ol>
    <button class="list__addItem">
        <img class="icon" src="imgs/list-item-add-plus.png">
        Add a card
    </button>
</div>
</li>`;


// Add a card to the list
function addNewItemTextarea(event) {
    let list = event.target.closest(".list__addItem").previousElementSibling;
    let card = `<li class="list__item"><textarea placeholder="Enter a title for the card" class="list__item-addText"></textarea></li>`;
    list.insertAdjacentHTML("beforeend", card);
    list.querySelector(".list__item-addText").focus();

    list.nextElementSibling.outerHTML = `<div class="list__addItem__buttons"><button class="list__addItem-confirm">Add a card</button>
    <button class="list_addItem-cancel"><img class="icon" src="imgs/addItem-cancel-cross.png"></button></div>`;

    list.querySelector(".list__item-addText").addEventListener("blur", (event) => {
        if (event.relatedTarget == document.querySelector(".list__addItem-confirm")) return addNewItem(event, true);
        return addNewItem(event, false);
    });
}

function addNewItem(event, confirm) {
    let textarea = document.querySelector(".list__item-addText");
    if (confirm) {
        textarea.closest(".list__item").innerHTML = `<span class="list__item-content">
            ${textarea.value}
        </span> 
        <button class="item__content-edit">
            <img class="icon" src="imgs/list-item-edit-pencil.png">
        </button>`;
    } else {
        textarea.closest(".list__item").remove();
    }

    document.querySelector(".list__addItem__buttons").outerHTML = `  <button class="list__addItem">
    <img class="icon" src="imgs/list-item-add-plus.png">
    Add a card
</button>`;
}
