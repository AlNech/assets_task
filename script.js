let assets = loadAssets();

const assetsList = document.getElementById('assetsList');
const addAssetBtn = document.getElementById('addAsset');
const assetModal = document.getElementById('assetModal');
const modalTitle = document.getElementById('modalTitle');
const assetForm = document.getElementById('assetForm');
const cancelBtn = document.getElementById('cancelBtn');
const assetTypeSelect = document.getElementById('assetType');
const moneyFields = document.getElementById('moneyFields');
const nonMoneyFields = document.getElementById('nonMoneyFields');
const closeBtn = document.querySelector('.close');

// Текущий актив (для редактирования или добавления нового)
let currentAssetId = null;


addAssetBtn.addEventListener('click', addAsset);
assetForm.addEventListener('submit', saveAsset);
cancelBtn.addEventListener('click', () => assetModal.style.display = 'none');
closeBtn.addEventListener('click', () => assetModal.style.display = 'none');
assetTypeSelect.addEventListener('change', (e) => toggleFieldsVisibility(e.target.value));

// Открытие модального окна
window.addEventListener('click', (e) => {
    if (e.target === assetModal) {
        assetModal.style.display = 'none';
    }
});


document.addEventListener('DOMContentLoaded', renderAssets);