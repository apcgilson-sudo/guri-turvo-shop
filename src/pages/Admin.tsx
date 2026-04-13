import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite, Product } from '@/contexts/SiteContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, updateSettings, products, setProducts, registrations, deleteRegistration, tradeAds, deleteTradeAd } = useSite();

  useEffect(() => {
    if (sessionStorage.getItem('admin-auth') !== 'true') navigate('/admin-login');
  }, [navigate]);

  const [editSettings, setEditSettings] = useState(settings);
  const [editProducts, setEditProducts] = useState<Product[]>(products);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ icon: '🎴', name: '', price: '', priceValue: 0, description: '', badge: '', featured: false });

  useEffect(() => { setEditSettings(settings); }, [settings]);
  useEffect(() => { setEditProducts(products); }, [products]);

  const saveSettings = () => {
    updateSettings(editSettings);
    toast({ title: '✅ Configurações salvas!' });
  };

  const saveProducts = () => {
    setProducts(editProducts);
    toast({ title: '✅ Produtos salvos!' });
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    const p: Product = {
      id: crypto.randomUUID(),
      icon: newProduct.icon || '🎴',
      name: newProduct.name!,
      price: newProduct.price!,
      priceValue: newProduct.priceValue || 0,
      description: newProduct.description || '',
      badge: newProduct.badge || undefined,
      featured: newProduct.featured || false,
    };
    setEditProducts(prev => [...prev, p]);
    setNewProduct({ icon: '🎴', name: '', price: '', priceValue: 0, description: '', badge: '', featured: false });
  };

  const removeProduct = (id: string) => setEditProducts(prev => prev.filter(p => p.id !== id));

  const updateProduct = (id: string, field: keyof Product, value: string | number | boolean) => {
    setEditProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const logout = () => {
    sessionStorage.removeItem('admin-auth');
    navigate('/admin-login');
  };

  const inputCls = "px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-verde outline-none transition-colors w-full";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-verde to-azul py-4 px-5 shadow-lg">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{settings.logoEmoji}</div>
            <div>
              <h1 className="font-bebas text-2xl text-amarelo tracking-wider">PAINEL ADMINISTRATIVO</h1>
              <p className="text-xs text-primary-foreground/70">{settings.storeName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-primary-foreground/80 hover:text-amarelo transition-colors font-semibold">Ver Site →</a>
            <button onClick={logout} className="px-4 py-2 rounded-full font-oswald text-sm tracking-wide font-semibold uppercase bg-destructive text-destructive-foreground hover:opacity-90 transition-all">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto p-5 md:p-8">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="mb-8 flex-wrap h-auto gap-1">
            <TabsTrigger value="settings" className="font-oswald tracking-wide">⚙️ Configurações</TabsTrigger>
            <TabsTrigger value="products" className="font-oswald tracking-wide">🛒 Produtos</TabsTrigger>
            <TabsTrigger value="registrations" className="font-oswald tracking-wide">👥 Cadastros ({registrations.length})</TabsTrigger>
            <TabsTrigger value="trades" className="font-oswald tracking-wide">🔄 Anúncios ({tradeAds.length})</TabsTrigger>
          </TabsList>

          {/* Settings */}
          <TabsContent value="settings">
            <div className="bg-card rounded-2xl p-6 md:p-8 border-2 border-border max-w-2xl">
              <h2 className="font-bebas text-3xl text-azul mb-6">CONFIGURAÇÕES DO SITE</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">Emoji / Logo</label>
                    <input value={editSettings.logoEmoji} onChange={e => setEditSettings(p => ({ ...p, logoEmoji: e.target.value }))} className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">Nome da Sorveteria</label>
                    <input value={editSettings.storeName} onChange={e => setEditSettings(p => ({ ...p, storeName: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">Subtítulo</label>
                  <input value={editSettings.storeSubtitle} onChange={e => setEditSettings(p => ({ ...p, storeSubtitle: e.target.value }))} className={inputCls} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">Endereço</label>
                    <input value={editSettings.address} onChange={e => setEditSettings(p => ({ ...p, address: e.target.value }))} className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">Cidade</label>
                    <input value={editSettings.city} onChange={e => setEditSettings(p => ({ ...p, city: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">WhatsApp (número)</label>
                    <input value={editSettings.whatsappNumber} onChange={e => setEditSettings(p => ({ ...p, whatsappNumber: e.target.value }))} className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">Link do Grupo WhatsApp</label>
                    <input value={editSettings.whatsappGroupLink} onChange={e => setEditSettings(p => ({ ...p, whatsappGroupLink: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <button onClick={saveSettings} className="px-8 py-3.5 rounded-full font-oswald text-base tracking-wide font-semibold uppercase bg-verde text-primary-foreground hover:bg-[#007d2f] hover:-translate-y-0.5 hover:shadow-xl transition-all">
                  💾 Salvar Configurações
                </button>
              </div>
            </div>
          </TabsContent>

          {/* Products */}
          <TabsContent value="products">
            <div className="bg-card rounded-2xl p-6 md:p-8 border-2 border-border">
              <h2 className="font-bebas text-3xl text-azul mb-6">GERENCIAR PRODUTOS</h2>
              <div className="space-y-4 mb-8">
                {editProducts.map(p => (
                  <div key={p.id} className="border-2 border-border rounded-xl p-4 flex flex-col md:flex-row gap-3 items-start">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1 w-full">
                      <input value={p.icon} onChange={e => updateProduct(p.id, 'icon', e.target.value)} className={inputCls} placeholder="Emoji" />
                      <input value={p.name} onChange={e => updateProduct(p.id, 'name', e.target.value)} className={`${inputCls} col-span-2`} placeholder="Nome" />
                      <input value={p.price} onChange={e => updateProduct(p.id, 'price', e.target.value)} className={inputCls} placeholder="Preço (texto)" />
                      <input type="number" step="0.01" value={p.priceValue} onChange={e => updateProduct(p.id, 'priceValue', parseFloat(e.target.value) || 0)} className={inputCls} placeholder="Valor" />
                      <input value={p.badge || ''} onChange={e => updateProduct(p.id, 'badge', e.target.value)} className={inputCls} placeholder="Badge (opcional)" />
                      <textarea value={p.description} onChange={e => updateProduct(p.id, 'description', e.target.value)} className={`${inputCls} col-span-full resize-y min-h-[60px]`} placeholder="Descrição" />
                      <label className="flex items-center gap-2 col-span-full">
                        <input type="checkbox" checked={p.featured} onChange={e => updateProduct(p.id, 'featured', e.target.checked)} className="w-4 h-4 accent-verde" />
                        <span className="text-sm font-semibold">Destaque</span>
                      </label>
                    </div>
                    <button onClick={() => removeProduct(p.id)} className="px-4 py-2 rounded-full text-sm font-bold bg-destructive text-destructive-foreground hover:opacity-90 transition-all flex-shrink-0">
                      🗑️ Remover
                    </button>
                  </div>
                ))}
              </div>
              {/* Add new */}
              <div className="border-2 border-verde/30 rounded-xl p-4 bg-[#f8fff9]">
                <h3 className="font-oswald text-lg text-verde font-bold mb-3">➕ Adicionar Produto</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  <input value={newProduct.icon} onChange={e => setNewProduct(p => ({ ...p, icon: e.target.value }))} className={inputCls} placeholder="Emoji" />
                  <input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} className={`${inputCls} col-span-2`} placeholder="Nome do produto" />
                  <input value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} className={inputCls} placeholder="Preço (ex: R$ 7,00)" />
                  <input type="number" step="0.01" value={newProduct.priceValue || ''} onChange={e => setNewProduct(p => ({ ...p, priceValue: parseFloat(e.target.value) || 0 }))} className={inputCls} placeholder="Valor numérico" />
                  <input value={newProduct.badge} onChange={e => setNewProduct(p => ({ ...p, badge: e.target.value }))} className={inputCls} placeholder="Badge (opcional)" />
                  <textarea value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} className={`${inputCls} col-span-full resize-y min-h-[60px]`} placeholder="Descrição" />
                </div>
                <button onClick={addProduct} className="px-6 py-3 rounded-full font-oswald text-sm tracking-wide font-semibold uppercase bg-verde text-primary-foreground hover:bg-[#007d2f] transition-all">
                  ➕ Adicionar
                </button>
              </div>
              <button onClick={saveProducts} className="mt-6 px-8 py-3.5 rounded-full font-oswald text-base tracking-wide font-semibold uppercase bg-amarelo text-accent-foreground hover:bg-[#ffd000] hover:-translate-y-0.5 hover:shadow-xl transition-all">
                💾 Salvar Produtos
              </button>
            </div>
          </TabsContent>

          {/* Registrations */}
          <TabsContent value="registrations">
            <div className="bg-card rounded-2xl p-6 md:p-8 border-2 border-border">
              <h2 className="font-bebas text-3xl text-azul mb-6">PESSOAS CADASTRADAS ({registrations.length})</h2>
              {registrations.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">Nenhum cadastro ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left py-3 px-2 font-oswald tracking-wide">Nome</th>
                        <th className="text-left py-3 px-2 font-oswald tracking-wide">WhatsApp</th>
                        <th className="text-left py-3 px-2 font-oswald tracking-wide">E-mail</th>
                        <th className="text-left py-3 px-2 font-oswald tracking-wide">Bairro</th>
                        <th className="text-left py-3 px-2 font-oswald tracking-wide">Produtos</th>
                        <th className="text-left py-3 px-2 font-oswald tracking-wide">Data</th>
                        <th className="py-3 px-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map(r => (
                        <tr key={r.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-2 font-semibold">{r.name}</td>
                          <td className="py-3 px-2">{r.whatsapp}</td>
                          <td className="py-3 px-2">{r.email || '-'}</td>
                          <td className="py-3 px-2">{r.bairro || '-'}</td>
                          <td className="py-3 px-2">
                            {r.products.map(pid => {
                              const prod = products.find(p => p.id === pid);
                              return prod ? <span key={pid} className="inline-block bg-[#e8f7ef] text-verde text-xs font-bold px-2 py-0.5 rounded mr-1 mb-1">{prod.icon} {prod.name}</span> : null;
                            })}
                          </td>
                          <td className="py-3 px-2 text-muted-foreground">{new Date(r.date).toLocaleDateString('pt-BR')}</td>
                          <td className="py-3 px-2">
                            <button onClick={() => deleteRegistration(r.id)} className="text-destructive hover:text-destructive/80 font-bold text-xs">🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Trade Ads */}
          <TabsContent value="trades">
            <div className="bg-card rounded-2xl p-6 md:p-8 border-2 border-border">
              <h2 className="font-bebas text-3xl text-azul mb-6">ANÚNCIOS DE TROCAS ({tradeAds.length})</h2>
              {tradeAds.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">Nenhum anúncio ainda.</p>
              ) : (
                <div className="space-y-3">
                  {tradeAds.map(a => (
                    <div key={a.id} className="border-2 border-border rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase ${a.type === 'oferta' ? 'bg-[#e8f7ef] text-verde' : a.type === 'busca' ? 'bg-[#dce8ff] text-azul' : 'bg-[#fff3b0] text-[#8a6000]'}`}>
                          {a.type === 'oferta' ? '📤 Oferta' : a.type === 'busca' ? '📥 Busca' : '💰 Venda'}
                        </span>
                        <div>
                          <p className="font-bold text-sm">Figurinha {a.stickerNumber} {a.country && `— ${a.country}`}</p>
                          <p className="text-xs text-muted-foreground">{a.name} · {a.whatsapp}</p>
                          {a.details && <p className="text-xs text-muted-foreground mt-0.5">{a.details}</p>}
                        </div>
                      </div>
                      <button onClick={() => deleteTradeAd(a.id)} className="text-destructive hover:text-destructive/80 font-bold text-sm flex-shrink-0">🗑️ Remover</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
