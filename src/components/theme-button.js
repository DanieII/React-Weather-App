import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const ThemeButton = () => {
  function toggleIcon() {
    const icons = document.querySelectorAll(".theme-icon");
    icons.forEach((icon) => {
      icon.classList.toggle("display-none");
    });
  }

  function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
    toggleIcon();
  }

  return (
    <div>
      <FontAwesomeIcon
        icon={faMoon}
        className="theme-icon"
        onClick={toggleDarkMode}
      />
      <FontAwesomeIcon
        icon={faSun}
        className="theme-icon display-none"
        onClick={toggleDarkMode}
      />{" "}
    </div>
  );
};

export default ThemeButton;
