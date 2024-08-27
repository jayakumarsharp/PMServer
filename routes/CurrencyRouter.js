import express from 'express';
import { getCurrencies, addCurrency, updateCurrency, deleteCurrency } from "../services/currencyService";

const currencyapiRouter = express.Router();

// Get all currencies
currencyapiRouter.get('/currencies', async (req, res) => {
    
    console.log("called currency api");
    const currencies = await getCurrencies();
    console.log(currencies);

    res.json(currencies);

    
});

// Add a new currency
currencyapiRouter.post('/currencies', async (req, res) => {
    const newCurrency = await addCurrency(req.body);
    res.json(newCurrency);
});

// Update a currency
currencyapiRouter.put('/currencies/:id', async (req, res) => {
    const updatedCurrency = await updateCurrency(req.params.id, req.body);
    res.json(updatedCurrency);
});

// Delete a currency
currencyapiRouter.delete('/currencies/:id', async (req, res) => {
    await deleteCurrency(req.params.id);
    res.json({ success: true });
});


export default currencyapiRouter;
