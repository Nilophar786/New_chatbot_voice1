import { evaluate } from 'mathjs';

export const solveMath = async (req, res) => {
  try {
    const { expression } = req.body;
    
    if (!expression) {
      return res.status(400).json({ error: "Expression is required" });
    }

    // Evaluate the mathematical expression
    const result = evaluate(expression);
    
    return res.status(200).json({ 
      expression,
      result: result.toString(),
      success: true 
    });
  } catch (error) {
    return res.status(400).json({ 
      error: "Invalid mathematical expression",
      details: error.message 
    });
  }
};

export const convertCurrency = async (req, res) => {
  try {
    const { from, to, amount } = req.body;
    
    if (!from || !to || !amount) {
      return res.status(400).json({ error: "From, to, and amount are required" });
    }

    // For now, we'll use a mock conversion rate
    // In production, integrate with ExchangeRate API
    const mockRates = {
      USD: { EUR: 0.85, GBP: 0.75, INR: 75.0 },
      EUR: { USD: 1.18, GBP: 0.88, INR: 88.0 },
      GBP: { USD: 1.33, EUR: 1.14, INR: 100.0 },
      INR: { USD: 0.013, EUR: 0.011, GBP: 0.01 }
    };

    const rate = mockRates[from]?.[to] || 1;
    const convertedAmount = (parseFloat(amount) * rate).toFixed(2);

    return res.status(200).json({
      from,
      to,
      amount: parseFloat(amount),
      convertedAmount,
      rate,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Currency conversion failed",
      details: error.message 
    });
  }
};
