import Header from "../atoms/header/Header";
import Footer from "../atoms/footer/Footer";
import "./Layout.scss";

type LayoutProps = {
  title: string;
  children: any;
};

function Layout({ title, children }: LayoutProps) {
  return (
    <div className="c-customer-page">
      <Header title={title} />
      <main className="c-customer-page__main">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
