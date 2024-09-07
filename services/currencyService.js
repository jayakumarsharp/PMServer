import { currencyMaster } from '../model/Currency';
import { trancodeMaster } from '../model/trancodes.js';
// Get all currencies
async function getCurrencies() {
    return await currencyMaster.find();
}

// Add a new currency
async function addCurrency(currencyData) {
    const newCurrency = new currencyMaster(currencyData);
    return await newCurrency.save();
}

// Update a currency
async function updateCurrency(id, currencyData) {
    return await currencyMaster.findByIdAndUpdate(id, currencyData, { new: true });
}

// Delete a currency
async function deleteCurrency(id) {
    return await currencyMaster.findByIdAndDelete(id);
}

async function getAllTrancodes() {
    return await trancodeMaster.find();
}

export { getCurrencies, addCurrency, updateCurrency, deleteCurrency,getAllTrancodes };
