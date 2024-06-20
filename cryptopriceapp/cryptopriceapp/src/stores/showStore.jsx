//imports that are needed
import create from 'zustand';
import axios from 'axios';

const showStore = create((set) => ({
  graphData: [],
  data: null,

  reset: () => {
    set({ graphData: [], data: null });
  },

  fetchData: async (id) => {
    try {
      const [graphRes, dataRes] = await Promise.all([
        axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
          {
            params: {
              vs_currency: 'usd', 
              days: 121, 
            },
          }
        ),
        axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}`,
          {
            params: {
              localization: false,
              market_data: true,
            },
          }
        ),
      ]);

      const graphData = graphRes.data.prices.map((price) => ({
        Date: new Date(price[0]).toLocaleDateString("en-us"),
        Price: price[1],
      }));

      set({ graphData, data: dataRes.data });
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  },
}));

export default showStore;
