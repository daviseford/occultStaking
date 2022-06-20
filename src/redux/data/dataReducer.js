const initialState = {
  loading: false,
  totalSupply: 0,
  walletBalance: 0,
  nftBalance: 0,
  nftOwned: [],
  cost: 0,
  approval: false,
  error: false,
  errorMsg: "",
  stakeList: [],
  stakeCount: 0,
  burnCount: 0,
  burnList: [],
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        totalSupply: action.payload.totalSupply,
        walletBalance: action.payload.walletBalance,
        nftBalance: action.payload.nftBalance,
        nftOwned: action.payload.nftOwned,
        approval: action.payload.approval,
        stakeList: action.payload.stakeList,
        stakeCount: action.payload.stakeCount,
        burnCount: action.payload.burnCount,
        burnList: action.payload.burnList,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
