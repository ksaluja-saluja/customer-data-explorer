import Header from "../atoms/header/Header";
import Footer from "../atoms/footer/Footer";
import "./Layout.scss";

type LayoutProps = {
  title: string;
  children: any;
};

function Layout({ title, children }: LayoutProps) {
  return (
    <div className="customer-page">
      <Header title={title} />
      <main className="customer-page__main">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
