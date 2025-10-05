import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ListProvider } from "./context/ListContext";
import ListPage from "./pages/ListPage";
import GalleryPage from "./pages/GalleryPage";
import DetailPage from "./pages/DetailPage";
import Header from "./components/Header"

const basename = process.env.NODE_ENV === "production" ? "/CS409_SQI8_MP2" : undefined;

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <ListProvider>
        <Header
          title="TMDB Recent Most Popular Movies Top 200"
        />
        <Routes>
          <Route path="/" element={<Navigate to="/list" replace />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/movie/:id" element={<DetailPage />} />
        </Routes>
      </ListProvider>
    </BrowserRouter>
  );
}
