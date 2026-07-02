import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import { usePantryStore } from './stores/pantryStore'
import { Home } from './screens/Home'
import { SearchResults } from './screens/SearchResults'
import { RecipeDetail } from './screens/RecipeDetail'
import { CookMode } from './screens/CookMode'
import { Completion } from './screens/Completion'
import { Onboarding } from './screens/Onboarding'
import { Pantry } from './screens/Pantry'
import { Cookbook } from './screens/Cookbook'
import { Profile } from './screens/Profile'
import { Gallery } from './screens/Gallery'

export default function App() {
  const location = useLocation()
  const onboarded = usePantryStore((s) => s.onboarded)

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      {/* 390-wide phone canvas — the app itself */}
      <div className="relative h-full max-h-[844px] w-full max-w-[390px] overflow-hidden bg-app sm:rounded-[42px] sm:shadow-2xl">
        <LayoutGroup>
          <AnimatePresence mode="popLayout" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={onboarded ? <Home /> : <Navigate to="/onboarding" replace />}
              />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/cook/:id" element={<CookMode />} />
              <Route path="/done/:id" element={<Completion />} />
              <Route path="/pantry" element={<Pantry />} />
              <Route path="/cookbook" element={<Cookbook />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  )
}
