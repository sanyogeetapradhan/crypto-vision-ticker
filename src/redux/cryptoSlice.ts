
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  last_updated: string;
}

interface CryptoState {
  data: CryptoData[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastUpdated: string | null;
}

const initialState: CryptoState = {
  data: [],
  status: 'idle',
  error: null,
  lastUpdated: null,
};

const COIN_GECKO_API = 'https://api.coingecko.com/api/v3';

// Create async thunk for fetching crypto data
export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchData',
  async () => {
    const coins = 'bitcoin,ethereum,tether,binancecoin,ripple,cardano,solana,polkadot,dogecoin,polygon';
    
    const response = await fetch(
      `${COIN_GECKO_API}/coins/markets?vs_currency=usd&ids=${coins}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h,24h,7d`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }
    
    const data = await response.json();
    return data as CryptoData[];
  }
);

// Create the crypto slice
const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export const { setStatus } = cryptoSlice.actions;
export default cryptoSlice.reducer;
