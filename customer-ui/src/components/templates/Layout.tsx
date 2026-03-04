import Header from "../atoms/Header";
import Footer from "../atoms/Footer";

type LayoutProps = {
  title: string;
  children: any;
};

function Layout({ title, children }: LayoutProps) {
  return (
    <div className="customer-page">
      <Header title={title} />
      <main className="customer-main">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
