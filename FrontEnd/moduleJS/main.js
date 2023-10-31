import apiUrl from './apiUrl.js';

const apiWorksUrl = `${apiUrl}works`;
const apiCategoriesUrl = `${apiUrl}categories`;

let categoriesData;
let modalPhotoCtn;
let modalPhoto;
let inputFileBtn;
let formSubmitButton;
let inputTitle;
let selectCategory;
let modalWrapper;
let worksData;
let isModalDisplay = false;

async function init() {
  isModalDisplay = false;
  
  const responseWorks = await fetch(apiWorksUrl);
  worksData = await responseWorks.json();
  afficherGallery(worksData);
  createModal();
  
  document.addEventListener('click', (event) => {
    if (event.target.closest(".modal") && isModalDisplay && !event.target.closest(".modal-wrapper")) {
      afficherModal();
    }
  });
  
  const responseCategories = await fetch(apiCategoriesUrl);
  categoriesData = await responseCategories.json();
  filters(categoriesData);
}

init();

async function loadWorks() {
  const responseWorks = await fetch(apiWorksUrl);
  worksData = await responseWorks.json();
  afficherGallery(worksData);
  displayDefaultModal();
}

const openModalLink = document.querySelector(".modif1");
openModalLink.addEventListener("click", afficherModal);

checkConnection();

function afficherGallery(data) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
  
  for (let i = 0; i < data.length; i++) {
    const figure = document.createElement("figure");
    figure.id = `image-${data[i].id}`;
    
    const imageElement = document.createElement("img");
    imageElement.src = data[i].imageUrl;
    
    const nomElement = document.createElement("p");
    nomElement.innerText = data[i].title;
    
    figure.appendChild(imageElement);
    figure.appendChild(nomElement);
    gallery.appendChild(figure);
  }
}

function filters(category) {

  //Ajout de la catégorie "Tous" dans le tableau category , unshift permet d'ajouter un élément au début du tableau :

  category.unshift({ name: "Tous" });
  const filterBtn = document.querySelector(".filtersBtn");
  filterBtn.innerHTML = '';
  
  //Boucle pour créer les boutons de filtres : 
  for (let i = 0; i < category.length; i++) {
    const filter = document.createElement("button");
    //Ajout du nom de la catégorie dans le bouton:
    filter.innerText = category[i].name;
    //création bouton filtre :
    filterBtn.appendChild(filter);
  }
  //Ajout de l'évènement click sur les boutons de filtres :
  const filterBtnEvent = document.querySelectorAll(".filtersBtn button");
  filterBtnEvent.forEach(button => {
    button.addEventListener("click", function () {
      document.querySelector(".gallery").innerHTML = '';
      
      //Filtre des données en fonction du nom de la catégorie :
      let filteredData = worksData.filter((item) => {
        return item.category.name === button.textContent || button.textContent === "Tous";
      });
      
      //Affichage des données filtrées :
      afficherGallery(filteredData);
    });
  });
}

function checkConnection() {
  const token = sessionStorage.getItem("token");
  
  const logoutBtn = document.querySelector(".logoutBtn");
  const loginIn = document.querySelector(".loginIn");
  const modif = document.querySelectorAll(".modif");
  const modif1 = document.querySelector(".modif1");
  const iconModif = document.querySelectorAll(".iconModif");
  const modificationIcon = document.querySelectorAll(".iconModification");
  const edition = document.querySelector(".Edition");
  const editionMode = document.createElement("button");
  editionMode.className = "editionBtn";
  editionMode.innerText = "Mode Edition";
  const publier = document.createElement("button");
  publier.className = "publierBtn";
  publier.innerText = "Publier les changements";
  
  if (token) {
    console.log("Connecté");
    
    const filterBtn = document.querySelector(".filtersBtn");
    filterBtn.style.display = "none";
    
    edition.style.display = "flex";
    edition.style.justifyContent = "center";
    edition.style.alignItems = "center";
    edition.appendChild(editionMode);
    edition.appendChild(publier);
    modificationIcon.forEach((element) => {
      element.className = "fas fa-pen-square";
    });
    
    logoutBtn.style.display = "block";
    loginIn.style.display = "none";
    modif.forEach((element) => {
      element.innerHTML = "modifier";
    });
    iconModif.forEach((element) => {
      element.className = "fa-regular fa-pen-to-square";
    });
    modif1.innerHTML = "modifier";
    
    logoutBtn.addEventListener("click", function () {
      sessionStorage.removeItem("token");
      console.log("Déconnexion réussie");
    });
  } else {
    console.log("Non connecté");
  }
}

function createModal() {
  modalWrapper = document.querySelector(".modal-wrapper");
  modalWrapper.innerHTML = "";
  
  let cross = document.createElement("i");
  cross.className = "cross fas fa-times";
  cross.addEventListener("click", (event) => {
    afficherModal();
    event.stopPropagation();
  });
  
  const modalAddTitle = document.createElement("h3");
  modalAddTitle.textContent = "Galerie photo";
  modalPhotoCtn = document.createElement("div");
  modalPhotoCtn.classList.add("photo-ctn");
  const modalBorder = document.createElement("div");
  modalBorder.classList.add("border");
  let modalAddButton = document.createElement("button");
  modalAddButton.classList.add("addButton");
  modalAddButton.textContent = "Ajouter une photo";
  const modalRemoveButton = document.createElement("button");
  modalRemoveButton.classList.add("removeButton");
  modalRemoveButton.textContent = "Supprimer la galerie";
  
  modalWrapper.appendChild(cross);
  modalWrapper.appendChild(modalAddTitle);
  modalWrapper.appendChild(modalPhotoCtn);
  modalWrapper.appendChild(modalBorder);
  modalWrapper.appendChild(modalAddButton);
  modalWrapper.appendChild(modalRemoveButton);
  
  modalAddButton = document.querySelector(".addButton");
  modalAddButton.addEventListener("click", createAddModal);
  
  galleryInModal();
}

function galleryInModal() {
  for (let i = 0; i < worksData.length; i++) {
    modalPhoto = document.createElement("div");
    modalPhoto.classList.add("modal-photo");
    modalPhoto.id = `image-${worksData[i].id}`;
    
    const modalPhotoImage = document.createElement("img");
    modalPhotoImage.src = worksData[i].imageUrl;
    modalPhotoImage.classList.add("modal-image");
    
    const modalTrashIcon = document.createElement("i");
    modalTrashIcon.classList.add("modal-trash-icon");
    modalTrashIcon.classList.add("fa-solid", "fa-trash-can");
    
    const modalUpDownLeftRightIcon = document.createElement("i");
    modalUpDownLeftRightIcon.classList.add("modal-up-down-left-right-icon");
    modalUpDownLeftRightIcon.classList.add("fa-solid", "fa-up-down-left-right");
    modalUpDownLeftRightIcon.setAttribute('style', 'display:none');
    
    modalPhotoImage.addEventListener("mouseenter", () => {
      modalUpDownLeftRightIcon.setAttribute('style', 'display:flex');
    });
    
    modalPhotoImage.addEventListener("mouseleave", () => {
      modalUpDownLeftRightIcon.setAttribute('style', 'display:none');
    });
    
    const modalPhotoTitle = document.createElement("h4");
    modalPhotoTitle.textContent = worksData[i].title;
    modalPhotoTitle.classList.add("modal-title");

    modalPhotoTitle.addEventListener("mouseenter", function() {
      this.textContent = "Éditer";
    });

    modalPhotoTitle.addEventListener("mouseleave", function() {
      this.textContent = worksData[i].title;
    });
    
    
modalPhotoTitle.addEventListener("click", function() {
  const input = document.createElement("input");
  input.type = "text";
  input.value = worksData[i].title;

  const button = document.createElement("button");
  button.textContent = "Valider";

  // Replace the title with the input and button
  this.replaceWith(input, button);

  button.addEventListener("click", function() {
    updateTitleInBackend(input.value, i)
      .then(() => {
        worksData[i].title = input.value;
        input.replaceWith(modalPhotoTitle);
        modalPhotoTitle.textContent = input.value;
        button.remove();
      })
      .catch(error => {
        console.log('Une erreur s\'est produite lors de la mise à jour du titre dans le backend:', error);
      });
  });
});

function updateTitleInBackend(newTitle, index) {
  return fetch('/updateTitle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ newTitle, index })
  })
  .then(response => {
    if (response.ok) {
      console.log('Le titre a été mis à jour avec succès dans le backend.');
    } else {
      console.log('Une erreur s\'est produite lors de la mise à jour du titre dans le backend.');
    }
  })
  .catch(error => {
    console.log('Une erreur s\'est produite lors de la requête vers le backend:', error);
  });
}
  

    
    modalPhoto.appendChild(modalPhotoImage);
    modalPhoto.appendChild(modalTrashIcon);
    modalPhoto.appendChild(modalUpDownLeftRightIcon);
    modalPhoto.appendChild(modalPhotoTitle);
    modalPhotoCtn.appendChild(modalPhoto);
    
    modalTrashIcon.addEventListener("click", function () {
      deleteModale(worksData[i].id);
      createModal();
      afficherModal();
      preventDefault();
    });
  }
}

function afficherModal() {
  const modalVisibility = document.getElementById('modalId');
  
  if (isModalDisplay) {
    modalVisibility.classList.add("modalInvisibility");
    isModalDisplay = false;
  } else {
    modalVisibility.classList.remove("modalInvisibility");
    isModalDisplay = true;
  }
}

async function deleteModale(id) {
  //vérifier si l'utilisateur est connecté
  const token = JSON.parse(sessionStorage.getItem("token"));
  //envoyer la requête de suppression
  const response = await fetch(`${apiWorksUrl}/${id}`, {
    method: "DELETE",   //méthode de la requête de suppression d'une image dans la base de données 
    headers: {
      "Accept": "*/*",
      "Authorization": `Bearer ${token.token}`
    }
  });
  
  //vérifier si la suppression s'est bien passée
  if (response.ok) {
    modalPhotoCtn.removeChild(modalPhoto);
    console.log("Image supprimée avec succès");
  } else {
    console.log("Erreur lors de la suppression de l'image côté serveur");
  }
  
  worksData = await loadWorks();
}

function createAddModal() {
  modalWrapper.innerHTML = "";
  
  const closeButton = document.createElement("i");
  closeButton.classList.add("fa-solid", "fa-times", "close-button");
  
  const ajoutPhoto = document.createElement("h3");
  ajoutPhoto.classList.add("ajoutPhoto");
  ajoutPhoto.innerHTML = "Ajout photo";
  
  const iconeBack = document.createElement("i");
  iconeBack.classList.add("fa-solid", "fa-arrow-left");
  
  const addForm = document.createElement("form");
  addForm.classList.add("addForm");
  const addBox = document.createElement("div");
  addBox.classList.add("addBox");
  const iconeImg = document.createElement("i");
  iconeImg.classList.add("fa-regular", "fa-image");
  const addImgButton = document.createElement("button");
  addImgButton.innerText = "+ Ajouter photo";
  addImgButton.classList.add("addImgButton");
  inputFileBtn = document.createElement("input");
  inputFileBtn.type = "file";
  inputFileBtn.accept = ".jpg, .png";
  inputFileBtn.classList.add("inputFileBtn");
  const photoPreview = document.createElement("img");
  photoPreview.id = "photoPreview";
  const addImgText = document.createElement("p");
  addImgText.innerText = "jpg, png : 4mo max";
  const inputCtn = document.createElement("div");
  inputCtn.classList.add("inputCtn");
  const labelInputTitle = document.createElement("label");
  labelInputTitle.setAttribute("for", "Title");
  labelInputTitle.innerText = "Titre";
  inputTitle = document.createElement("input");
  inputTitle.id = "Title";
  inputTitle.type = "text";
  const labelSelectCategory = document.createElement("label");
  labelSelectCategory.setAttribute("for", "category");
  labelSelectCategory.innerText = "Catégorie";
  selectCategory = document.createElement("select");
  selectCategory.classList.add("optionCategorie");
  selectCategory.id = "category";
  
  const border = document.createElement("div");
  border.classList.add("border");
  formSubmitButton = document.createElement("input");
  formSubmitButton.classList.add("formSubmitButton");
  formSubmitButton.classList.add("buttonDisable");
  formSubmitButton.type = "submit";
  formSubmitButton.value = "Valider";
  formSubmitButton.disabled = true;
  
  addForm.appendChild(addBox);
  addBox.appendChild(iconeImg);
  addBox.appendChild(addImgButton);
  addBox.appendChild(inputFileBtn);
  addBox.appendChild(photoPreview);
  addBox.appendChild(addImgText);
  addForm.appendChild(inputCtn);
  inputCtn.appendChild(labelInputTitle);
  inputCtn.appendChild(inputTitle);
  inputCtn.appendChild(labelSelectCategory);
  inputCtn.appendChild(selectCategory);
  addForm.appendChild(border);
  addForm.appendChild(formSubmitButton);
  
  modalWrapper.appendChild(closeButton);
  modalWrapper.appendChild(ajoutPhoto);
  modalWrapper.appendChild(iconeBack);
  modalWrapper.appendChild(addForm);
  
  insertCategories(selectCategory);
  
  inputFileBtn.addEventListener("change", () => {
    const [file] = inputFileBtn.files;
    if (file) {
      photoPreview.src = URL.createObjectURL(file);
      addImgButton.classList.add("modalHide");
    }
  });
  
  inputFileBtn.addEventListener("change", validateForm);
  inputTitle.addEventListener("input", validateForm);
  selectCategory.addEventListener("change", validateForm);
  
  closeButton.addEventListener("click", afficherModal);
  iconeBack.addEventListener("click", displayDefaultModal);
}

function displayDefaultModal() {
  isModalDisplay = true;
  afficherModal();
  isModalDisplay = false;
  createModal();
  afficherModal();
}

function validateForm() {
  if (inputFileBtn.value !== "" && inputTitle.value !== "" && selectCategory.value !== "0") {
    formSubmitButton.disabled = false;
    formSubmitButton.classList.add("buttonEnable");
    formSubmitButton.classList.remove("buttonDisable");
    
    formSubmitButton.addEventListener("click", (e) => {
      postNewWork(inputFileBtn, inputTitle, selectCategory);
      e.preventDefault();
    });
  } else {
    formSubmitButton.classList.add("buttonDisable");
    formSubmitButton.classList.remove("buttonEnable");
    formSubmitButton.disabled = true;
  }
}

async function loadCategories() {
  const response = await fetch(apiCategoriesUrl);
  const categories = await response.json();
  return categories;
}

async function insertCategories(selectCategory) {
  const categories = await loadCategories();
  categories.unshift({ id: 0, name: "Choisissez une catégorie :" });
  for (let i = 0; i < categories.length; i++) {
    const option = document.createElement("option");
    selectCategory.appendChild(option);
    option.innerHTML = categories[i].name;
    option.value = categories[i].id;
  }
}

async function postNewWork(inputFileBtn, inputTitle, selectCategory) {
  const formData = new FormData();
  const newWorkImg = inputFileBtn.files[0];
  const newWorkTitle = inputTitle.value;
  const newWorkCategory = selectCategory.value;
  const token = JSON.parse(sessionStorage.getItem("token"));
  
  formData.append("image", newWorkImg);
  formData.append("title", newWorkTitle);
  formData.append("category", newWorkCategory);
  
  const response = await fetch(apiWorksUrl, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "Authorization": `Bearer ${token.token}`,
    },
    body: formData
  });
  
  if (response.ok) {
    worksData = await loadWorks();
  }
}
