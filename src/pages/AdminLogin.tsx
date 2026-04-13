import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === 'sorvetesguriturvo' && password === 'Gil559744@') {
      sessionStorage.setItem('admin-auth', 'true');
      navigate('/admin');
    } else {
      toast({ title: 'Erro', description: 'Login ou senha incorretos.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-verde via-[#005e22] to-azul flex items-center justify-center px-5">
      <div className="bg-card rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍦</div>
          <h1 className="font-bebas text-4xl text-azul tracking-wider">PAINEL ADM</h1>
          <p className="text-sm text-muted-foreground">Acesse o painel de controle</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-foreground">Login</label>
            <input type="text" required value={login} onChange={e => setLogin(e.target.value)} placeholder="Seu login" className="px-4 py-3.5 rounded-xl border-2 border-border bg-card text-foreground focus:border-verde outline-none transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-foreground">Senha</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" className="px-4 py-3.5 rounded-xl border-2 border-border bg-card text-foreground focus:border-verde outline-none transition-colors" />
          </div>
          <button type="submit" className="w-full px-8 py-4 rounded-full font-oswald text-lg tracking-wide font-semibold uppercase bg-verde text-primary-foreground hover:bg-[#007d2f] hover:-translate-y-0.5 hover:shadow-xl transition-all">
            Entrar
          </button>
        </form>
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-muted-foreground hover:text-verde transition-colors">← Voltar ao site</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
