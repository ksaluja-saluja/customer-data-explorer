import reactLogo from "../../../assets/react.svg";
import "./Header.scss";

type HeaderProps = {
  title: string;
};

function Header({ title }: HeaderProps) {
  return (
    <header className="c-app-header">
      <div className="c-app-header__brand">
        <img src={reactLogo} className="c-app-header__logo" alt="React logo" />
        <h1 className="c-app-header__title">{title}</h1>
      </div>
    </header>
  );
}

export default Header;
