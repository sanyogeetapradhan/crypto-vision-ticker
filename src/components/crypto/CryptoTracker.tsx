
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCryptoData } from '@/redux/cryptoSlice';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const CryptoTracker = () => {
  const dispatch = useAppDispatch();
  const { data, status, error, lastUpdated } = useAppSelector((state) => state.crypto);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Initial fetch and set up interval for refreshing data
  useEffect(() => {
    dispatch(fetchCryptoData());

    const interval = setInterval(() => {
      dispatch(fetchCryptoData());
    }, 30000); // Refresh every 30 seconds

    setRefreshInterval(interval);

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [dispatch]);

  // Show toast when data updates
  useEffect(() => {
    if (status === 'succeeded' && lastUpdated) {
      toast({
        title: "Data updated",
        description: `Crypto prices refreshed at ${new Date(lastUpdated).toLocaleTimeString()}`,
        duration: 3000,
      });
    } else if (status === 'failed' && error) {
      toast({
        title: "Error fetching data",
        description: error,
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [status, lastUpdated, error, toast]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value >= 1 ? 2 : 6,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <section id="crypto-tracker" className="py-20 px-4 bg-crypto-darkest">
      <div className="container mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Crypto Tracker</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Real-time cryptocurrency data with latest prices, market cap, and performance metrics. Data updates every 30 seconds.
          </p>
          <div className="mt-4 text-sm text-gray-400">
            {lastUpdated && (
              <p>Last updated: {new Date(lastUpdated).toLocaleTimeString()}</p>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="glass-card p-6">
              <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-400 mb-4 px-4">
                <div className="col-span-1">#</div>
                <div className="col-span-2">Name</div>
                <div className="col-span-1">Price</div>
                <div className="col-span-1 text-center">1h %</div>
                <div className="col-span-1 text-center">24h %</div>
                <div className="col-span-1 text-center">7d %</div>
                <div className="col-span-2">Market Cap</div>
                <div className="col-span-1">Volume (24h)</div>
                <div className="col-span-2">Circulating Supply</div>
              </div>

              {status === 'loading' && data.length === 0 && (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-purple"></div>
                  <p className="mt-4 text-gray-400">Loading crypto data...</p>
                </div>
              )}

              {data.length > 0 && (
                <div className="space-y-2">
                  {data.map((crypto) => (
                    <div 
                      key={crypto.id}
                      className="grid grid-cols-12 gap-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4 items-center"
                    >
                      <div className="col-span-1 text-gray-300">{crypto.market_cap_rank}</div>
                      <div className="col-span-2 flex items-center">
                        <img 
                          src={crypto.image} 
                          alt={crypto.name} 
                          className="w-6 h-6 mr-2"
                        />
                        <div>
                          <p className="font-medium text-white">{crypto.name}</p>
                          <p className="text-xs text-gray-400">{crypto.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="col-span-1 font-medium text-white">
                        {formatCurrency(crypto.current_price)}
                      </div>
                      <div className={`col-span-1 text-center ${crypto.price_change_percentage_1h_in_currency >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                        <div className="flex items-center justify-center">
                          {crypto.price_change_percentage_1h_in_currency >= 0 ? 
                            <ArrowUp className="w-3 h-3 mr-1" /> : 
                            <ArrowDown className="w-3 h-3 mr-1" />
                          }
                          {formatPercentage(crypto.price_change_percentage_1h_in_currency)}
                        </div>
                      </div>
                      <div className={`col-span-1 text-center ${crypto.price_change_percentage_24h_in_currency >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                        <div className="flex items-center justify-center">
                          {crypto.price_change_percentage_24h_in_currency >= 0 ? 
                            <ArrowUp className="w-3 h-3 mr-1" /> : 
                            <ArrowDown className="w-3 h-3 mr-1" />
                          }
                          {formatPercentage(crypto.price_change_percentage_24h_in_currency)}
                        </div>
                      </div>
                      <div className={`col-span-1 text-center ${crypto.price_change_percentage_7d_in_currency >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                        <div className="flex items-center justify-center">
                          {crypto.price_change_percentage_7d_in_currency >= 0 ? 
                            <ArrowUp className="w-3 h-3 mr-1" /> : 
                            <ArrowDown className="w-3 h-3 mr-1" />
                          }
                          {formatPercentage(crypto.price_change_percentage_7d_in_currency)}
                        </div>
                      </div>
                      <div className="col-span-2 text-gray-200">
                        ${formatNumber(crypto.market_cap)}
                      </div>
                      <div className="col-span-1 text-gray-200">
                        ${formatNumber(crypto.total_volume)}
                      </div>
                      <div className="col-span-2 text-gray-200">
                        <div className="flex items-center">
                          <span className="mr-1">{formatNumber(crypto.circulating_supply)}</span>
                          <span className="text-xs text-gray-400">{crypto.symbol.toUpperCase()}</span>
                        </div>
                        {crypto.max_supply && (
                          <div className="mt-1 w-full bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-crypto-purple to-crypto-blue h-1.5 rounded-full" 
                              style={{ width: `${(crypto.circulating_supply / crypto.max_supply) * 100}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {status === 'failed' && (
                <Card className="bg-red-900/20 border-red-700 p-4 text-center">
                  <p className="text-red-300">Failed to load crypto data: {error}</p>
                  <button 
                    onClick={() => dispatch(fetchCryptoData())}
                    className="mt-2 bg-white/10 px-4 py-2 rounded-md hover:bg-white/20"
                  >
                    Retry
                  </button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
