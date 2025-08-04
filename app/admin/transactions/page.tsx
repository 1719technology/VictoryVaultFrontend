"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

// Mock data
const mockTransactions = [
  {
    id: 1,
    type: "Spend & Save Interest",
    date: "Aug 2nd, 2025 02:27:45",
    amount: "+₦0.09",
    status: "Successful",
    category: "%",
  },
  {
    id: 2,
    type: "OWealth Interest Earned",
    date: "Aug 2nd, 2025 02:02:51",
    amount: "+₦0.09",
    status: "Successful",
    category: "%",
  },
  {
    id: 3,
    type: "Spend & Save Deposit",
    date: "Aug 1st, 2025 15:51:44",
    amount: "₦1,000.00",
    status: "Successful",
    category: "💰",
  },
  {
    id: 4,
    type: "Bonus from Airtime Purchase",
    date: "Aug 1st, 2025 15:51:44",
    amount: "+₦20.00",
    status: "Successful",
    category: "🎁",
  },
];

export default function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [showBalance, setShowBalance] = useState(false);

  if (selectedTransaction) {
    // Detail View
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="flex items-center p-4 bg-red-600 text-white shadow">
          <button onClick={() => setSelectedTransaction(null)} className="mr-3">
            ←
          </button>
          <h2 className="text-lg font-semibold">Transaction Details</h2>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <div className="text-center mb-4">
              <p className="text-lg font-semibold">{selectedTransaction.type}</p>
              <p className="text-2xl font-bold text-red-600">{selectedTransaction.amount}</p>
              <p className="text-green-600 mt-1">{selectedTransaction.status}</p>
            </div>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium">Transaction ID:</span> 250802996U...
              </p>
              <p>
                <span className="font-medium">Date:</span> {selectedTransaction.date}
              </p>
              <p>
                <span className="font-medium">Credited to:</span> Spend & Save
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-6 bg-red-600 text-white shadow flex items-center space-x-4">
        <img
          src="https://i.pravatar.cc/50"
          alt="avatar"
          className="w-12 h-12 rounded-full border-2 border-white"
        />
        <div>
          <h2 className="text-lg font-semibold">Hi, saeedrido</h2>
          <div className="flex items-center space-x-2 text-sm">
            <span className="bg-white text-red-600 px-2 py-0.5 rounded">Tier 3</span>
          </div>
          <div className="flex items-center text-sm mt-1">
            <span className="mr-2">Total Balance</span>
            <button onClick={() => setShowBalance(!showBalance)} className="focus:outline-none">
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-lg font-bold mt-1">
            {showBalance ? "₦7,020.36" : "****"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center p-4 bg-gray-100 text-sm">
        <div className="flex space-x-2">
          <select className="border rounded px-2 py-1">
            <option>All Categories</option>
          </select>
          <select className="border rounded px-2 py-1">
            <option>All Status</option>
          </select>
        </div>
        <button className="text-red-600 font-medium">Download</button>
      </div>

      {/* Month Summary */}
      <div className="px-4 py-2 text-gray-600">
        <p className="text-sm">
          Aug 2025 - <span className="font-medium">In: ₦7,020.36</span> | Out: ₦2,000.00
        </p>
      </div>

      {/* Transaction List */}
      <div className="divide-y">
        {mockTransactions.map((tx) => (
          <div
            key={tx.id}
            className="flex justify-between items-center p-4 bg-white hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedTransaction(tx)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                {tx.category}
              </div>
              <div>
                <p className="text-sm font-medium">{tx.type}</p>
                <p className="text-xs text-gray-500">{tx.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-semibold ${
                  tx.amount.startsWith("+") ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.amount}
              </p>
              <p className="text-xs text-green-600">{tx.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
