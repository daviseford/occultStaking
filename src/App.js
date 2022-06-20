import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { WalletItems } from "./components/WalletItems";
import { StakeItems } from "./components/StakeItems";
//import ReactSelect from 'react-select';

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = React.useState(false);
  const [feedback, setFeedback] = React.useState(`Select which NFTs to stake.`);
  const [selected, setSelected] = React.useState([]);
  const [toStake, setSelectedStake] = React.useState([]);

  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const stakeNFTs = (nftlist) => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit * nftlist.length);
    console.log("Gas limit: ", totalGasLimit);

    if (nftlist.length == 0) {
      console.log("no nft");
      setFeedback(`First you must select which NFT to stake`);
    } else {
      if (data.approval) {
        setClaimingNft(true);

        setFeedback(`Staking your ${CONFIG.NFT_NAME}...`);
        console.log("staking: ", nftlist.length);
        blockchain.stakeContract.methods
          .stake(nftlist)
          .send({
            gasLimit: String(totalGasLimit),
            to: CONFIG.STAKE_ADDRESS,
            from: blockchain.account,
            value: 0,
          })
          .once("error", (err) => {
            console.log(err);
            setFeedback("Sorry, something went wrong please try again later.");
            setClaimingNft(false);
          })
          .then((receipt) => {
            console.log(receipt);
            setFeedback(`The NFT is staked.`);
            unselectAll();
            setClaimingNft(false);
            dispatch(fetchData(blockchain.account));
          });
      } else {
        setFeedback(`Missing approval for ${CONFIG.NFT_NAME}...`);
        console.log("missing approval");
      }
    }
  };

  const burnNFTs = (nftlist) => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit * nftlist.length);
    console.log("Gas limit: ", totalGasLimit);

    if (nftlist.length == 0) {
      console.log("no nft");
      setFeedback(`First you must select which NFT to burn`);
    } else {
      if (data.approval) {
        setClaimingNft(true);

        setFeedback(`Burning your ${CONFIG.NFT_NAME}...`);
        console.log("Burning: ", nftlist.length);
        blockchain.stakeContract.methods
          .burnNFT(nftlist)
          .send({
            gasLimit: String(totalGasLimit),
            to: CONFIG.STAKE_ADDRESS,
            from: blockchain.account,
            value: 0,
          })
          .once("error", (err) => {
            console.log(err);
            setFeedback("Sorry, something went wrong please try again later.");
            setClaimingNft(false);
          })
          .then((receipt) => {
            console.log(receipt);
            setFeedback(`The NFT is burnt.`);
            unselectAll();
            setClaimingNft(false);
            dispatch(fetchData(blockchain.account));
          });
      } else {
        setFeedback(`Missing approval for ${CONFIG.NFT_NAME}...`);
        console.log("missing approval");
      }
    }
  };

  const unstakeNFTs = (nftlist) => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit * nftlist.length);
    console.log("Gas limit: ", totalGasLimit);

    if (nftlist.length == 0) {
      console.log("no nft");
      setFeedback(`First you must select which NFT to stake`);
    } else {
      setClaimingNft(true);

      setFeedback(`Unstaking your ${CONFIG.NFT_NAME}...`);
      console.log("unstaking: ", nftlist.length);
      blockchain.stakeContract.methods
        .withdraw(nftlist)
        .send({
          gasLimit: String(totalGasLimit),
          to: CONFIG.STAKE_ADDRESS,
          from: blockchain.account,
          value: 0,
        })
        .once("error", (err) => {
          console.log(err);
          setFeedback("Sorry, something went wrong please try again later.");
          setClaimingNft(false);
        })
        .then((receipt) => {
          console.log(receipt);
          setFeedback(`The NFT is unstaked and reward sent.`);
          unselectAllStake();
          setClaimingNft(false);
          dispatch(fetchData(blockchain.account));
        });
    }
  };

  const getApproval = () => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit);
    console.log("Gas limit: ", totalGasLimit);

    setClaimingNft(true);

    if (data.approval == false) {
      setFeedback(`Getting approval for ${CONFIG.NFT_NAME}...`);
      console.log("getting approval");
      blockchain.smartContract.methods
        .setApprovalForAll(CONFIG.STAKE_ADDRESS, true)
        .send({
          gasLimit: String(totalGasLimit),
          to: CONFIG.CONTRACT_ADDRESS,
          from: blockchain.account,
          value: 0,
        })
        .once("error", (err) => {
          console.log(err);
          setFeedback("Sorry, something went wrong please try again later.");
          setClaimingNft(false);
        })
        .then((receipt) => {
          console.log(receipt);
          setFeedback(`The NFT has approval.`);
          setClaimingNft(false);
          dispatch(fetchData(blockchain.account));
        });
    }
  };

  const claim = () => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit);
    console.log("Gas limit: ", totalGasLimit);

    setClaimingNft(true);

    setFeedback(`Claiming reward for ${CONFIG.NFT_NAME}...`);
    console.log("getting reward");
    blockchain.stakeContract.methods
      .getReward()
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: 0,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`The reward was sent to you.`);
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    setClaimingNft(true);

    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }

    setClaimingNft(false);
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  function importImages(r) {
    let images = {};
    r.keys().forEach((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  }

  const images = importImages(
    require.context("../src/nftimages", false, /\.(png|jpe?g|svg|mp4)$/)
  );

  const onSelect = (number) => {
    setSelected((prevState) => {
      if (prevState.includes(number)) {
        // It was selected previously, unselect it (remove it from the array)
        return prevState.filter((x) => x !== number);
      }

      // Otherwise, add the number to the array
      return [...prevState, number];
    });
  };

  // bonus for future use
  const unselectAll = () => setSelected([]);
  const selectAll = () => setSelected(numbers);

  const onSelectStake = (number) => {
    setSelectedStake((prevState) => {
      if (prevState.includes(number)) {
        // It was selected previously, unselect it (remove it from the array)
        return prevState.filter((x) => x !== number);
      }

      // Otherwise, add the number to the array
      return [...prevState, number];
    });
  };

  // bonus for future use
  const unselectAllStake = () => setSelectedStake([]);
  const selectAllStake = () => setSelectedStake(numbers);

  const burnItems = data.burnList.map((number) => (
    <img
      style={{
        cursor: "pointer",
        width: "150px",
        borderRadius: "8px",
        borderColor: toStake.includes(number) ? "green" : "initial", // do whatever to indicate it's selected
      }}
      src={images[number + 1 + ".png"].default}
      alt={"coin"}
      key={number.toString()}
    />
  ));

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={
          CONFIG.SHOW_BACKGROUND ? "/config/images/char-box-export.png" : null
        }
      >
        <StyledLogo alt={"logo"} src={"/config/images/play-export.png"} />
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextTitle
                      style={{
                        textAlign: "center",
                        fontSize: 50,
                        fontWeight: "bold",
                        color: "var(--accent-text)",
                      }}
                    ></s.TextTitle>
                    <s.SpacerSmall />
                    {Number(data.totalSupply) == 0 ? (
                      <>
                        <s.TextTitle
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          Loading data.
                        </s.TextTitle>
                      </>
                    ) : (
                      <>
                        <s.TextTitle
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          $OULS Balance: {data.walletBalance}
                          <s.SpacerSmall />
                          NFT owned: {data.nftBalance}
                          <s.SpacerSmall />
                          Number of Stake selected: {selected.length}
                          <s.SpacerSmall />
                          Has approval: {data.approval ? "yes" : "no"}
                          <s.SpacerSmall />
                          Number of NFT staked: {data.stakeCount}
                          <s.SpacerSmall />
                          Number of NFT burnt: {data.burnCount}
                          <s.SpacerSmall />
                          Number of unstake selected: {toStake.length}
                          <s.SpacerSmall />
                          Wallet List:
                          <s.SpacerSmall />
                          {data?.nftOwned?.map((number) => (
                            <WalletItems
                              number={number}
                              selected={selected}
                              images={images}
                              onSelect={onSelect}
                            />
                          ))}
                        </s.TextTitle>
                      </>
                    )}
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          data.approval ? stakeNFTs(selected) : getApproval();
                          getData();
                        }}
                      >
                        {claimingNft
                          ? "BUSY"
                          : data.approval == false && data.nftBalance > 0
                          ? "APPROVAL"
                          : "STAKE"}
                      </StyledButton>
                      <s.SpacerSmall />
                      {data.approval == true && data.nftBalance ? (
                        <StyledButton
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            data.approval ? burnNFTs(selected) : getApproval();
                            getData();
                          }}
                        >
                          {claimingNft
                            ? "BUSY"
                            : data.approval == false && data.nftBalance > 0
                            ? "APPROVAL"
                            : "BURN"}
                        </StyledButton>
                      ) : (
                        <> </>
                      )}
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <s.TextTitle
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        Staked List:
                        <s.SpacerSmall />
                        {data?.stakeList?.map((number) => (
                          <StakeItems
                            number={number}
                            toStake={toStake}
                            images={images}
                            onSelectStake={onSelectStake}
                          />
                        ))}
                      </s.TextTitle>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <s.SpacerSmall />
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          unstakeNFTs(toStake);
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "UNSTAKE"}
                      </StyledButton>
                      <s.SpacerSmall />
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claim();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "CLAIM"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
            {Number(data.totalSupply) > 0 ? (
              <s.TextTitle
                style={{ textAlign: "center", color: "var(--accent-text)" }}
              >
                Burnt List:
                <s.SpacerSmall />
                {burnItems}
              </s.TextTitle>
            ) : (
              <> </>
            )}
          </s.Container>
          <s.SpacerLarge />
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            <StyledLink target={"_blank"} href={CONFIG.NFT_LINK}>
              NFT Contract {CONFIG.CONTRACT_ADDRESS}
            </StyledLink>
            <s.SpacerSmall />
            <StyledLink target={"_blank"} href={CONFIG.STAKE_LINK}>
              Staking Contract {CONFIG.STAKE_ADDRESS}
            </StyledLink>
            <s.SpacerSmall />
            <StyledLink target={"_blank"} href={CONFIG.TOKEN_LINK}>
              Token Contract {CONFIG.TOKEN_ADDRESS}
            </StyledLink>
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
