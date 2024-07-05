const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// In-memory data store
const dataStore = {
    numbers: [],
    windowSize: 10
};

const fetchNumber = async (numberId) => {
    try {
        const response = await axios.get(`http://20.244.56.144/test/numbers/${numberId}`, { timeout: 500 });
        if (response.status === 200 && !response.data.error) {
            return response.data.number;
        }
    } catch (error) {
        console.error('Error fetching number:', error.message);
    }
    return null;
};

app.get('/numbers/:numberId', async (req, res) => {
    const numberId = req.params.numberId;

 
    const validNumberTypes = ['p', 'f', 'e', 'r'];
    if (!validNumberTypes.includes(numberId)) {
        return res.status(400).json({ error: 'Invalid number type' });
    }

    
    const numbersBefore = [...dataStore.numbers];

    
    const newNumber = await fetchNumber(numberId);

    if (newNumber !== null && !dataStore.numbers.includes(newNumber)) {
        if (dataStore.numbers.length >= dataStore.windowSize) {
           
            dataStore.numbers.shift();
        }
        dataStore.numbers.push(newNumber);
    }

   
    const average = dataStore.numbers.length > 0 ? dataStore.numbers.reduce((a, b) => a + b, 0) / dataStore.numbers.length : 0;

 
    const numbersAfter = [...dataStore.numbers];

    const response = {
        numbersBefore: numbersBefore,
        numbersAfter: numbersAfter,
        average: average
    };

    res.json(response);
});

app.listen(port, () => {
    console.log(`Microservice running on http://localhost:${port}`);
});
