import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import GameList from '@/components/home/GameList';

export default function Home() {
  return (
    <div className="min-h-screen bg-animated">
      <Header />
      <main>
        <Hero />
        <GameList />
      </main>
      <Footer />
    </div>
  );
}
