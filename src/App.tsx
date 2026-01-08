import React, { useEffect } from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  Users, 
  BarChart3, 
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  Globe,
  LogOut
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './components/ui/dropdown-menu';
import { Dashboard } from './components/Dashboard';
import { FileImport } from './components/FileImport';
import { EmployeeList } from './components/EmployeeList';
import { Charts } from './components/Charts';
import { LoginPage } from './components/LoginPage';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { useStore } from './store/useStore';
import { useLanguage, languageNames, languageFlags, Language } from './i18n';

function AppContent() {
  const { theme, toggleTheme } = useStore();
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('dashboard');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'charts', label: t.nav.charts, icon: BarChart3 },
    { id: 'employees', label: t.nav.employees, icon: Users },
    { id: 'import', label: t.nav.import, icon: Upload },
    { id: 'admin', label: t.nav.settings, icon: Settings },
  ];

  const languages: Language[] = ['uz', 'ru', 'en'];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 hover:bg-muted rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <img 
                src="/logo.jpg" 
                alt="Gloriya Global" 
                className="h-10 w-10 rounded-lg object-contain"
              />
              <div>
                <h1 className="text-lg font-bold">Gloriya Global</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {t.appDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* User Info Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.username}</p>
                  <p className="text-xs text-muted-foreground capitalize">Role: {user?.role}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Chiqish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={language === lang ? 'bg-accent' : ''}
                  >
                    <span className="mr-2">{languageFlags[lang]}</span>
                    {languageNames[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 animate-slide-in">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="container px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="hidden md:inline-flex">
            {navItems.map((item) => (
              <TabsTrigger key={item.id} value={item.id} className="gap-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="dashboard" className="animate-fade-in">
            <div className="space-y-6">
              <Dashboard />
            </div>
          </TabsContent>

          <TabsContent value="import" className="animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <FileImport />
            </div>
          </TabsContent>

          <TabsContent value="employees" className="animate-fade-in">
            <EmployeeList />
          </TabsContent>

          <TabsContent value="charts" className="animate-fade-in">
            <Charts />
          </TabsContent>

          <TabsContent value="admin" className="animate-fade-in">
            <div className="max-w-4xl mx-auto">
              {/* Admin Panel component */}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t py-6 mt-auto">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>{t.appName} © {new Date().getFullYear()}</p>
          <p className="mt-1">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;