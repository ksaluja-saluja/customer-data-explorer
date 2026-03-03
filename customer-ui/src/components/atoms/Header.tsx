import reactLogo from "../../assets/react.svg";

type HeaderProps = {
  title: string;
};

function Header({ title }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <img src={reactLogo} className="header-logo" alt="React logo" />
        <h1 className="header-title">{title}</h1>
      </div>
    </header>
  );
}

export default Header;