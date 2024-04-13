//Board clicks handler
function boardClickHandler(event) {
    if (event.target.closest(".list__addItem")) return addNewItemTextarea(event);
    if (event.target.className == "list-addList") return addNewList(event);
}
document.querySelector(".board").addEventListener("click", boardClickHandler);

// Add a list
function addNewList(event) {
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
    document.querySelector(".list-add").insertAdjacentHTML("beforebegin", listItem);
    lists.push(new List());
}

// Add a card to the list
function addNewItemTextarea(event) {
    let list = event.target.closest(".list__addItem").previousElementSibling;
    let card = `<li class="list__item"><textarea placeholder="Enter a title for the card" class="list__item-addText"></textarea></li>`;
    list.insertAdjacentHTML("beforeend", card);
    list.querySelector(".list__item-addText").focus();

    list.nextElementSibling.outerHTML = `<div class="list__addItem__buttons"><button class="list__addItem-confirm">Add a card</button>
    <button class="list_addItem-cancel"><img class="icon" src="imgs/addItem-cancel-cross.png"></button></div>`;

    list.querySelector(".list__item-addText").addEventListener("blur", (event) => {
        if (event.relatedTarget == document.querySelector(".list__addItem-confirm")) return addNewItem(list, true);
        return addNewItem(list, false);
    });
}

function addNewItem(list, confirm) {
    let textarea = document.querySelector(".list__item-addText");
    if (confirm) {
        textarea.closest(".list__item").innerHTML = `<span class="list__item-content">
            ${textarea.value}
        </span> 
        <button class="item__content-edit">
            <img class="icon" src="imgs/list-item-edit-pencil.png">
        </button>`;
        let currentList = list.closest(".list-wrapper");
        let curerntListIndex = Array.from(currentList.parentNode.children).indexOf(currentList);
        lists[curerntListIndex].addItem(textarea.value)
    } else {
        textarea.closest(".list__item").remove();
    }

    document.querySelector(".list__addItem__buttons").outerHTML = `  <button class="list__addItem">
    <img class="icon" src="imgs/list-item-add-plus.png">
    Add a card
    </button>`;
}

//list class
let lists = [];
class List {
    constructor() {
        this.items = [];
    }
    addItem(item) {
        this.items.push(item);
    }
    removeItem(index) {
        this.items.splice(index, 1);
    }
}

// Delete a card from the list
function contextMenuHandler(event) {
    let listItem = event.target.closest('.list__item');
    if (!listItem) return;
    let listItemIndex = Array.from(listItem.parentNode.children).indexOf(listItem);
    let listIndex = Array.from(event.target.closest('.list-wrapper').parentNode.children).indexOf(event.target.closest('.list-wrapper'));

    event.preventDefault()

    let div = document.createElement('div');
    div.className = 'contextMenuBackground';
    document.body.append(div);
    listItem.classList.add('focused')

    //on click on the background
    div.addEventListener('click', function() {
        this.remove();
        listItem.classList.remove('focused');
        document.querySelector('.list__item-contextMenu').remove()
    });
    div.addEventListener('contextmenu', (event) => event.preventDefault())

    let contextMenu = document.createElement('div');
    contextMenu.className = 'list__item-contextMenu';
    contextMenu.textContent = 'Delete'
    listItem.append(contextMenu);
    //on click on the remove button
    contextMenu.addEventListener('click', function(event) {
        document.querySelector('.contextMenuBackground').remove();
        listItem.remove();
        lists[listIndex].removeItem(listItemIndex);
    });
}


document.addEventListener('contextmenu', contextMenuHandler)