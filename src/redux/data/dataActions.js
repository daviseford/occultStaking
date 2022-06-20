// log
import store from "../store";
//import Web3 from "web3";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      const configResponse = await fetch("/config/config.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const CONFIG = await configResponse.json();
      
      //let account2 = Web3.utils.toChecksumAddress(account);

      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();

      let nftBalance = await store
         .getState()
         .blockchain.smartContract.methods.balanceOf(account)
         .call();

      let approval = await store
        .getState()
        .blockchain.smartContract.methods.isApprovedForAll(account,CONFIG.STAKE_ADDRESS)
        .call();


      let nftOwned = [];
      let owner = 0;

      if (nftBalance > 0) {
        for (var i = 0; i <= totalSupply; i++) {
          owner = await store
            .getState()
            .blockchain.smartContract.methods.ownerOf(i)
            .call();
            if (owner.toLowerCase() == account.toLowerCase()) {
              nftOwned.push(i);
              if (nftOwned.length == nftBalance || nftOwned.length == 200) {
                break;
              }
            }
        }
      }

      let stakeCount = await store
        .getState()
        .blockchain.stakeContract.methods.userStakeBalance(account)
        .call();

      let stakeList = await store
        .getState()
        .blockchain.stakeContract.methods.stakeList(account)
        .call();

      let burnCount = await store
        .getState()
        .blockchain.stakeContract.methods.userBurntBalance(account)
        .call();

      let burnList = await store
        .getState()
        .blockchain.stakeContract.methods.burntList(account)
        .call();

      let walletBalance = await store
        .getState()
        .blockchain.tokenContract.methods.balanceOf(account)
        .call();

      dispatch(
        fetchDataSuccess({
          totalSupply,
          walletBalance,
          nftBalance,
          nftOwned,
          approval,
          stakeCount,
          stakeList,
          burnCount,
          burnList,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
