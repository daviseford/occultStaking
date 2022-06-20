export const StakeItems = ({ number, images, toStake, onSelectStake }) => {
  const imgUrl = `${number + 1}.png`;

  if (!images[imgUrl]) {
    console.error(`Could not find the image for #${number + 1}`);
    return null;
  }

  const isSelected = toStake.includes(number);

  return (
    <img
      style={{
        cursor: "pointer",
        width: "150px",
        border: isSelected ? "2px solid green" : "initial", // do whatever to indicate it's selected
        borderRadius: "8px",
      }}
      src={images[imgUrl].default}
      alt={"coin"}
      key={number.toString()}
      onClick={(e) => {
        e.preventDefault();
        onSelectStake(number);
      }}
    />
  );
};
