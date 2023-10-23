import styles from "../style";

const Button = ({ label, iconURL, fullWidth, isStyle, type }) => {
  return (
    <button
      className={`${styles.flexCenter} leading-none rounded-full ${isStyle} ${
        fullWidth && "w-full"
      }`}
      type={type}
    >
      {iconURL && <img src={iconURL} alt="" className="mr-2 rounded-full" />}
      {label}
    </button>
  );
};

export default Button;
