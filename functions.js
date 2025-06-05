/*

Содержимое файла:
CRUD - для активов
loadAssets() - заполнение localStorage начальными данными
renderAssets() - загрузка списка активов с кнопками Редактировать и Удалить
toggleFieldsVisibility(assetType) - для отрисовки формы  зависимости от типа актива(денежный, неденежный)

*/

const ASSETS_STORAGE_KEY = 'financial_assets';

function loadAssets() {
    const savedAssets = localStorage.getItem(ASSETS_STORAGE_KEY);
    if (savedAssets) {
        return JSON.parse(savedAssets);
    } else {
        return [
            {
                id: 1,
                name: "Счет №5 в ЕвроВорБанке",
                type: "money",
                amount: 1000,
                currency: "рубли",
                bankName: "ЕвроВорБанк",
                accountNumber: "5"
            },
            {
                id: 2,
                name: "Счет №3 во Внешторгабке",
                type: "money",
                amount: 5,
                currency: "доллары",
                bankName: "Внешторгабк",
                accountNumber: "3"
            },
            {
                id: 3,
                name: "Касса (наличные)",
                type: "money",
                amount: 100,
                currency: "рубли",
                bankName: "",
                accountNumber: ""
            },
            {
                id: 4,
                name: "Талон на бензин от Аспека",
                type: "money",
                amount: 3000,
                currency: "талоны на бензин",
                bankName: "",
                accountNumber: ""
            },
            {
                id: 5,
                name: "Торговое здание на Бассейной-6",
                type: "nonMoney",
                initialCost: 30000,
                residualCost: 5000,
                estimatedCost: 1000000,
                inventoryNumber: "7",
                productionDate: "1970-01-01",
                address: "Бассейная-6"
            },
            {
                id: 6,
                name: "Гвозди",
                type: "nonMoney",
                initialCost: 1000,
                residualCost: 100,
                estimatedCost: 2000,
                productionDate: "2000-01-01",
                quantity: 100,
                unit: "кг"
            }
        ];
    }
}

function renderAssets() {
    assetsList.innerHTML = '';
    
    assets.forEach(asset => {
        const assetItem = document.createElement('div');
        assetItem.className = 'asset-item';
        
        let details = '';
        if (asset.type === 'money') {
            details = `${asset.amount} ${asset.currency}`;
            if (asset.bankName) {
                details += ` (${asset.bankName}, счет ${asset.accountNumber})`;
            } else {
                details += ` (касса)`;
            }
        } else {
            details = `Нач. стоимость: ${asset.initialCost}, Остаточная: ${asset.residualCost}, Оценка: ${asset.estimatedCost}`;
            if (asset.inventoryNumber) {
                details += `, Инв. №${asset.inventoryNumber}`;
            }
            if (asset.quantity) {
                details += `, ${asset.quantity} ${asset.unit || ''}`;
            }
            if (asset.productionDate) {
                details += `, ${new Date(asset.productionDate).getFullYear()} г.`;
            }
        }
        
        assetItem.innerHTML = `
            <div>
                <strong>${asset.name}</strong>
                <div class="asset-details">${details}</div>
            </div>
            <div class="asset-actions">
                <button class="btn btn-primary edit-btn" data-id="${asset.id}">Редактировать</button>
                <button class="btn btn-secondary delete-btn" data-id="${asset.id}">Удалить</button>
            </div>
        `;
        
        assetsList.appendChild(assetItem);
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editAsset(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteAsset(parseInt(btn.dataset.id)));
    });
}

function editAsset(id) {
    const asset = assets.find(a => a.id === id);
    if (!asset) return;
    
    currentAssetId = id;
    modalTitle.textContent = 'Редактирование актива';

    assetForm.assetName.value = asset.name;
    assetForm.assetType.value = asset.type;
    
    if (asset.type === 'money') {
        assetForm.amount.value = asset.amount;
        assetForm.currency.value = asset.currency;
        assetForm.bankName.value = asset.bankName || '';
        assetForm.accountNumber.value = asset.accountNumber || '';
    } else {
        assetForm.initialCost.value = asset.initialCost;
        assetForm.residualCost.value = asset.residualCost;
        assetForm.estimatedCost.value = asset.estimatedCost;
        assetForm.inventoryNumber.value = asset.inventoryNumber || '';
        assetForm.productionDate.value = asset.productionDate || '';
        assetForm.quantity.value = asset.quantity || '';
        assetForm.unit.value = asset.unit || '';
        assetForm.address.value = asset.address || '';
    }
    
    toggleFieldsVisibility(asset.type);
    assetModal.style.display = 'block';
}


function addAsset() {
    currentAssetId = null;
    modalTitle.textContent = 'Добавление актива';
    assetForm.reset();
    assetForm.assetType.value = 'money';
    toggleFieldsVisibility('money');
    assetModal.style.display = 'block';
}

function deleteAsset(id) {
    if (confirm('Вы уверены, что хотите удалить этот актив?')) {
        assets = assets.filter(asset => asset.id !== id);
        saveAssets(assets);
        renderAssets();
    }
}

function saveAsset(e) {
    e.preventDefault();
    
    const formData = new FormData(assetForm);
    const assetType = formData.get('assetType');

    const assetData = {
        id: currentAssetId,
        name: formData.get('assetName'),
        type: assetType
    };
    
    if (assetType === 'money') {
        assetData.amount = parseFloat(formData.get('amount'));
        assetData.currency = formData.get('currency');
        assetData.bankName = formData.get('bankName');
        assetData.accountNumber = formData.get('accountNumber');
    } else {
        assetData.initialCost = parseFloat(formData.get('initialCost'));
        assetData.residualCost = parseFloat(formData.get('residualCost'));
        assetData.estimatedCost = parseFloat(formData.get('estimatedCost'));
        assetData.inventoryNumber = formData.get('inventoryNumber');
        assetData.productionDate = formData.get('productionDate');
        assetData.quantity = parseFloat(formData.get('quantity')) || undefined;
        assetData.unit = formData.get('unit') || undefined;
        assetData.address = formData.get('address') || undefined;
    }
    
    if (currentAssetId) {
        assets = assets.map(asset => 
            asset.id === currentAssetId ? assetData : asset
        );
    } else {
        assetData.id = assets.length + 1;
        currentAssetId = assets.length + 1;
        assets.unshift(assetData);
    }

    saveAssets(assets); 
    assetModal.style.display = 'none';
    renderAssets();
}

function toggleFieldsVisibility(assetType) {
    if (assetType === 'money') {
        moneyFields.style.display = 'block';
        nonMoneyFields.style.display = 'none';
    } else {
        moneyFields.style.display = 'none';
        nonMoneyFields.style.display = 'block';
    }
}

// Сохранение данных в localStorage
function saveAssets(assets) {
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
}