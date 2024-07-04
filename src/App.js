import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

function App() {
  const [totalKills, setTotalKills] = useState(0);
  const [itemDrops, setItemDrops] = useState([0, 0, 0]);
  const [results, setResults] = useState(null);

  const calculateStats = () => {
    const dropRates = itemDrops.map(drops => drops / totalKills);
    
    // Standard deviation (using binomial distribution approximation)
    const stdDev = dropRates.map(p => 
      Math.sqrt(p * (1 - p) / totalKills)
    );

    // 95% Confidence Interval
    const zScore = 1.96; // for 95% confidence
    const confidenceIntervals = dropRates.map((rate, index) => {
      const margin = zScore * stdDev[index];
      return [
        Math.max(0, rate - margin),
        Math.min(1, rate + margin)
      ];
    });

    setResults({
      dropRates,
      confidenceIntervals
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-2xl font-bold">Monster Loot Calculator</CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Total Kills:</label>
              <Input
                type="number"
                value={totalKills}
                onChange={(e) => setTotalKills(Number(e.target.value))}
                min="0"
              />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <label className="block mb-1">Item {i} Drops:</label>
                <Input
                  type="number"
                  value={itemDrops[i - 1]}
                  onChange={(e) => {
                    const newItemDrops = [...itemDrops];
                    newItemDrops[i - 1] = Number(e.target.value);
                    setItemDrops(newItemDrops);
                  }}
                  min="0"
                />
              </div>
            ))}
            <Button onClick={calculateStats}>Calculate</Button>
          </div>
          {results && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Results:</h3>
              <ul className="list-disc list-inside">
                {results.dropRates.map((rate, i) => (
                  <li key={i}>
                    Item {i + 1} Drop Rate: {(rate * 100).toFixed(2)}% 
                    <br />
                    95% Confidence Interval: {(results.confidenceIntervals[i][0] * 100).toFixed(2)}% - {(results.confidenceIntervals[i][1] * 100).toFixed(2)}%
                  </li>
                  
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;