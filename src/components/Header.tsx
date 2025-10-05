import { Link } from "react-router-dom";
import s from "./Header.module.css";

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  return (
    <header className={s.header}>
      <h1 className={s.title}>{title}</h1>
      <nav className={s.nav}>
        <Link to="/list" className={s.btn}>Search</Link>
        <Link to="/gallery" className={s.btn}>Gallery</Link>
      </nav>
    </header>
  );
}
