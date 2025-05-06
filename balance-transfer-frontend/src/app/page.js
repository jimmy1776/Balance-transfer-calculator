'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    balance: '',
    apr: '',
    transfer_fee_percent: '5',
    months: '18',
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8080/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        balance: parseFloat(formData.balance),
        apr: parseFloat(formData.apr),
        transfer_fee_percent: parseFloat(formData.transfer_fee_percent),
        months: parseInt(formData.months),
      }),
    });

    const data = await res.json();
    setResult(data);
  };

  const inputStyles =
    'w-full p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Balance Transfer Savings Calculator</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <input
          name="balance"
          type="number"
          placeholder="Current Balance ($)"
          value={formData.balance}
          onChange={handleChange}
          className={inputStyles}
          required
        />
        <input
          name="apr"
          type="number"
          placeholder="Current APR (%)"
          value={formData.apr}
          onChange={handleChange}
          className={inputStyles}
          required
        />
        <input
          name="transfer_fee_percent"
          type="number"
          placeholder="Transfer Fee (%)"
          value={formData.transfer_fee_percent}
          onChange={handleChange}
          className={inputStyles}
        />
        <input
          name="months"
          type="number"
          placeholder="Months to Pay Off"
          value={formData.months}
          onChange={handleChange}
          className={inputStyles}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
        >
          Calculate Savings
        </button>
      </form>

      {result && (
        <div className="text-gray-800">
          <div className="mt-6 bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-2">
            <h2 className="text-lg font-bold mb-2 text-green-600">Your Results:</h2>
            <p><strong>Interest Without Transfer:</strong> ${result.interest_without_transfer}</p>
            <p><strong>Transfer Fee:</strong> ${result.transfer_fee}</p>
            <p><strong>Monthly Payment (18 months):</strong> ${result.monthly_payment_to_pay_off}</p>
            <p><strong>Net Savings:</strong> ${result.net_savings}</p>
          </div>
        </div>
      )}
    </div>
  );
}
