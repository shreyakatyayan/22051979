const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

// My custom number window class
class NumberWindow {
  constructor(size = 10) {
    this.size = size;
    this.numbers = [];
    this.callCount = 0; // For debugging
  }
  
  addNumbers(newNumbers) {
    this.callCount++;
    console.log(Processing call #${this.callCount} with numbers:, newNumbers);
    
    const prevState = [...this.numbers];
    const uniqueNumbers = [...new Set(newNumbers)]; // Remove duplicates
    
    // Add numbers to window
    uniqueNumbers.forEach(num => {
      if (!this.numbers.includes(num)) { // No duplicates in window
        if (this.numbers.length >= this.size) {
          this.numbers.shift(); // Remove oldest if full
        }
        this.numbers.push(num);
      }
    });
    
    return {
      previous: prevState,
      current: [...this.numbers],
      added: uniqueNumbers,
      avg: this.getAverage()
    };
  }
  
  getAverage() {
    if (this.numbers.length === 0) return 0;
    const sum = this.numbers.reduce((a, b) => a + b, 0);
    return parseFloat((sum / this.numbers.length).toFixed(2));
  }
}

const numberWindow = new NumberWindow();

// API endpoint mapping - I put this here instead of a config file
const apiEndpoints = {
  'p': 'primes',
  'f': 'fibo',
  'e': 'even',
  'r': 'rand'
};

app.get('/numbers/:type', async (req, res) => {
  const type = req.params.type;
  
  if (!apiEndpoints[type]) {
    return res.status(400).json({ error: 'Invalid number type' });
  }
  
  try {
    // My custom timeout logic
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 480)
    );
    
    const apiPromise = axios.get(
      http://20.244.56.144/evaluation-service/${apiEndpoints[type]}
    );
    
    const response = await Promise.race([apiPromise, timeoutPromise]);
    const numbers = response.data.numbers || [];
    
    const result = numberWindow.addNumbers(numbers);
    res.json({
      windowPrevState: result.previous,
      windowCurrState: result.current,
      numbers: result.added,
      avg: result.avg
    });
    
  } catch (err) {
    console.log('Error occurred:', err.message);
    res.status(500).json({ 
      error: 'Failed to process numbers',
      details: err.message 
    });
  }
});

app.listen(port, () => {
  console.log(Server running on port ${port});
});
