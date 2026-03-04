import reactLogo from "../../../assets/react.svg";
import "./Header.scss";

type HeaderProps = {
  title: string;
};

function Header({ title }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <img src={reactLogo} className="app-header__logo" alt="React logo" />
        <h1 className="app-header__title">{title}</h1>
      </div>
    </header>
  );
}

export default Header;