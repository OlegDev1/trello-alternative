//Board clicks handler
function boardClickHandler(event) {
    if (event.target.closest(".list__addItem")) return addNewItemTextarea(event);
    if (event.target.className == "list-addList") return addNewList(event);
    if (event.target.closest(".item__content-edit")) return editCardHandler(event);
    if (event.target.closest(".list__settings")) return listContextMenuHandler(event);
    if (event.target.className == "list__name") return renameList(event);
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
        document.removeEventListener("keydown", keyHandler);
        if (event.relatedTarget == document.querySelector(".list__addItem-confirm")) return addNewItem(list, true);
        return addNewItem(list, false);
    });
    function keyHandler(event) {
        if (event.code == "Enter" && !event.shiftKey) {
            event.preventDefault();
            document.querySelector(".list__addItem-confirm").focus();
            document.removeEventListener("keydown", keyHandler);
        }
    }
    document.addEventListener("keydown", keyHandler);
}

function addNewItem(list, confirm) {
    let textarea = document.querySelector(".list__item-addText");
    if (confirm && textarea.value) {
        textarea.closest(".list__item").innerHTML = `<span class="list__item-content">
            ${textarea.value}
        </span> 
        <button class="item__content-edit">
            <img class="icon" src="imgs/list-item-edit-pencil.png">
        </button>`;
        let currentList = list.closest(".list-wrapper");
        let curerntListIndex = Array.from(currentList.parentNode.children).indexOf(currentList);
        lists[curerntListIndex].addItem(textarea.value);
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
        this.name = "";
        this.items = [];
    }
    addItem(item) {
        this.items.push(item);
    }
    editItem(index, item) {
        this.items[index] = item;
    }
    removeItem(index) {
        this.items.splice(index, 1);
    }
}

// Delete a card from the list
function contextMenuHandler(event) {
    let listItem = event.target.closest(".list__item");
    if (!listItem) return;
    let listItemIndex = Array.from(listItem.parentNode.children).indexOf(listItem);
    let listIndex = Array.from(event.target.closest(".list-wrapper").parentNode.children).indexOf(
        event.target.closest(".list-wrapper")
    );

    event.preventDefault();

    let div = document.createElement("div");
    div.className = "contextMenuBackground";
    document.body.append(div);
    listItem.classList.add("focused");

    //on click on the background
    div.addEventListener("click", function () {
        this.remove();
        listItem.classList.remove("focused");
        document.querySelector(".list__item-contextMenu").remove();
    });
    div.addEventListener("contextmenu", (event) => event.preventDefault());

    let contextMenu = document.createElement("div");
    contextMenu.className = "list__item-contextMenu";
    contextMenu.textContent = "Delete";
    listItem.append(contextMenu);
    //on click on the remove button
    contextMenu.addEventListener("click", function (event) {
        document.querySelector(".contextMenuBackground").remove();
        listItem.remove();
        lists[listIndex].removeItem(listItemIndex);
    });
}
document.addEventListener("contextmenu", contextMenuHandler);

// Edit a card
function editCardHandler(event) {
    let item = event.target.closest(".list__item");
    event.target.closest(
        ".list__items"
    ).nextElementSibling.outerHTML = `<div class="list__addItem__buttons"><button class="list__addItem-confirm edit">Save</button>
    <button class="list_addItem-cancel edit"><img class="icon" src="imgs/addItem-cancel-cross.png"></button></div>`;

    let text = item.children[0].textContent.trim();
    item.innerHTML = "";
    let textarea = `<textarea placeholder="Enter the data" class="list__item-addText edit">${text}</textarea>`;
    item.insertAdjacentHTML("beforeend", textarea);
    textarea = document.querySelector(".list__item-addText.edit");
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);

    textarea.addEventListener("blur", (event) => {
        document.removeEventListener("keydown", keyHandler);
        if (event.relatedTarget == document.querySelector(".list__addItem-confirm.edit"))
            return editCardSave(textarea, text, true);
        return editCardSave(textarea, text, false);
    });

    function keyHandler(event) {
        if (event.code == "Enter" && !event.shiftKey) {
            event.preventDefault();
            document.querySelector(".list__addItem-confirm").focus();
            document.removeEventListener("keydown", keyHandler);
        }
    }
    document.addEventListener("keydown", keyHandler);
}
function editCardSave(textarea, previousText, confirm) {
    let listItemIndex = Array.from(textarea.closest(".list__item").parentNode.children).indexOf(
        textarea.closest(".list__item")
    );
    let listIndex = Array.from(textarea.closest(".list-wrapper").parentNode.children).indexOf(
        textarea.closest(".list-wrapper")
    );

    document.querySelector(".list__addItem__buttons").outerHTML = `<button class="list__addItem">
    <img class="icon" src="imgs/list-item-add-plus.png">
    Add a card
    </button>`;

    textarea.closest(".list__item").innerHTML = `<span class="list__item-content">
    ${confirm ? textarea.value : previousText}
    </span> 
    <button class="item__content-edit">
    <img class="icon" src="imgs/list-item-edit-pencil.png">
    </button>`;
    lists[listIndex].editItem(listItemIndex, confirm ? textarea.value : previousText);
}

//Change list name and remove a list
const listSettingsButton = `<button class="list__settings">
<img class="icon" src="imgs/list-settings-dots.png">
</button>`;
const listContextMenu = `<div class="list__settings-contextMenu">
    <h2 class="settings__contextMenu__header">Actions with the list</h2>
    <button class="contextMenu-removeList">Remove a list</button>
</div>`;

function listContextMenuHandler(event) {
    console.log("a");
    let button = event.target.closest(".list__settings");
    button.outerHTML = `<div class="settings-wrapper">${button.outerHTML} ${listContextMenu}</div>`;

    document.addEventListener("mousedown", function (event) {
        if (event.target.closest(".settings-wrapper")) return;
        if (document.querySelector(".settings-wrapper"))
            document.querySelector(".settings-wrapper").outerHTML = listSettingsButton;
        event.currentTarget.removeEventListener(event.type, arguments.callee);
    });

    document.querySelector(".list__settings-contextMenu").addEventListener("click", (event) => {
        if (event.target.closest(".contextMenu-removeList")) return removeList(event);
    });
}

function renameList(event) {
    let input = document.createElement("input");
    input.className = "list__name input";
    input.value = event.target.textContent;
    event.target.replaceWith(input);
    input.focus();
    input.addEventListener("blur", function (event) {
        let listIndex = Array.from(input.closest(".list-wrapper").parentNode.children).indexOf(
            input.closest(".list-wrapper")
        );
        input.outerHTML = `<h2 class="list__name">${input.value}</h2>`;
        lists[listIndex].name = input.value;
    });
    input.addEventListener("keydown", function (event) {
        if (event.code == "Enter") input.blur();
    });
}
function removeList(event) {
    let listIndex = Array.from(event.target.closest(".list-wrapper").parentNode.children).indexOf(
        event.target.closest(".list-wrapper")
    );
    event.target.closest(".list-wrapper").remove();
    lists.splice(listIndex, 1);
}

//Card drag and drop
document.querySelector(".board").addEventListener("mousedown", function (event) {
    let item = event.target.closest(".list__item");
    if (!item) return;
    let itemHeight = getComputedStyle(item).height;
    item.style.width = getComputedStyle(item).width;
    item.classList.add("dragged");

    let shiftX = event.clientX - item.getBoundingClientRect().left;
    let shiftY = event.clientY - item.getBoundingClientRect().top;

    let currentList = null;
    function mouseMove(event) {
        item.style.left = event.clientX - shiftX + "px";
        item.style.top = event.clientY - shiftY + "px";

        item.style.visibility = "hidden";
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        item.style.visibility = "visible";

        const closestWrapper = elemBelow.closest(".list-wrapper");
        if (!closestWrapper) return;
        currentList = closestWrapper

        if (document.querySelector(".list__item.empty")) document.querySelector(".list__item.empty").remove();

        try {
            let li = document.createElement("li");
            li.className = "list__item empty";
            li.style.height = itemHeight;

            closestWrapper.querySelector(".list__items").append(li);
        } catch (e) {
            // debugger
        }
    }
    document.addEventListener("mousemove", mouseMove);

    function mouseRelease(event) {
        const emptyList = document.querySelector(".list__item.empty");
        emptyList.replaceWith(item);
        item.classList.remove("dragged");
        item.removeAttribute("style");

        document.removeEventListener("mousemove", mouseMove);
        event.currentTarget.removeEventListener(event.type, arguments.callee);
    }
    document.addEventListener("mouseup", mouseRelease);
});
