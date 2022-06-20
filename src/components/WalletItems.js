export const WalletItems = ({ number, images, selected, onSelect }) => {
  const imgUrl = `${number + 1}.png`;

  if (!images[imgUrl]) {
    console.error(`Could not find the image for #${number + 1}`);
    return null;
  }

  const isSelected = selected.includes(number);

  console.log(
    `${number} is currently ${isSelected ? "selected" : "unselected"}`
  );



  return (
    <img
      style={{
        cursor: "pointer",
        width: "100px",
        border: isSelected ? "2px solid green" : "initial", // do whatever to indicate it's selected
      }}
      src={images[imgUrl].default}
      alt={"coin"}
      key={number.toString()}
      onClick={(e) => {
        e.preventDefault();
        onSelect(number); // Let `onSelect` figure out what to do with it
        //console.log("selected: ", number);
      }}
    />
  );
};
